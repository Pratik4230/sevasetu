import { Booking } from "./booking.model";
import { ProviderProfile } from "../providers/provider.model";
import { AppError } from "../../shared/utils/app-error";
import { uploadToCloudinary } from "../../shared/utils/cloudinary.utils";
import {
  transition,
  canCustomerCancel,
} from "./booking.state-machine";
import type {
  CreateBookingInput,
  RescheduleInput,
  CancelInput,
  WorkNotesInput,
  QuoteInput,
  ListQuery,
} from "./booking.validation";
import mongoose from "mongoose";

// ─── Helper ────────────────────────────────────────────────────────────────

const pushHistory = (
  booking: any,
  actorId: string,
  note?: string
) => {
  booking.statusHistory.push({
    status: booking.status,
    changedAt: new Date(),
    changedBy: new mongoose.Types.ObjectId(actorId),
    note,
  });
};

// ─── Customer Operations ────────────────────────────────────────────────────

export const createBooking = async (
  customerId: string,
  data: CreateBookingInput,
  file?: Express.Multer.File
) => {
  // Verify provider exists and is available
  const providerProfile = await ProviderProfile.findOne({
    userId: data.providerId,
    approvalStatus: "approved",
    isAvailable: true,
  });

  if (!providerProfile) {
    throw new AppError("Provider is not available or does not exist", 404);
  }

  let attachmentImage: string | undefined;
  let attachmentImagePublicId: string | undefined;

  if (file) {
    const result = await uploadToCloudinary(
      file.buffer,
      "sevasetu/booking-attachments"
    );
    attachmentImage = result.secure_url;
    attachmentImagePublicId = result.public_id;
  }

  const booking = await Booking.create({
    customerId,
    providerId: data.providerId,
    serviceCategoryId: data.serviceCategoryId,
    address: data.address,
    scheduledAt: data.scheduledAt,
    notes: data.notes,
    attachmentImage,
    attachmentImagePublicId,
    status: "requested",
    statusHistory: [
      {
        status: "requested",
        changedAt: new Date(),
        changedBy: new mongoose.Types.ObjectId(customerId),
      },
    ],
  });

  return booking;
};

export const getCustomerBookings = async (
  customerId: string,
  query: ListQuery
) => {
  const filter: Record<string, any> = { customerId };
  if (query.status) filter.status = query.status;

  const skip = (query.page - 1) * query.limit;
  const [bookings, total] = await Promise.all([
    Booking.find(filter)
      .populate("providerId", "name avatar")
      .populate("serviceCategoryId", "name iconUrl")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(query.limit),
    Booking.countDocuments(filter),
  ]);

  return {
    bookings,
    pagination: {
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    },
  };
};

export const getBookingById = async (id: string, userId: string) => {
  const booking = await Booking.findById(id)
    .populate("customerId", "name email phone avatar")
    .populate("providerId", "name email phone avatar")
    .populate("serviceCategoryId", "name iconUrl");

  if (!booking) throw new AppError("Booking not found", 404);

  const isOwner =
    booking.customerId._id.toString() === userId ||
    booking.providerId._id.toString() === userId;

  if (!isOwner) throw new AppError("Access denied", 403);

  return booking;
};

export const rescheduleBooking = async (
  bookingId: string,
  customerId: string,
  data: RescheduleInput
) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new AppError("Booking not found", 404);

  if (booking.customerId.toString() !== customerId) {
    throw new AppError("Access denied", 403);
  }

  // State machine validates the status
  transition({
    currentStatus: booking.status,
    action: "reschedule",
    actor: "customer",
    scheduledAt: data.scheduledAt,
  });

  booking.rescheduledAt = data.scheduledAt;
  booking.scheduledAt = data.scheduledAt;
  pushHistory(booking, customerId, "Booking rescheduled by customer");
  await booking.save();

  return booking;
};

export const cancelByCustomer = async (
  bookingId: string,
  customerId: string,
  data: CancelInput
) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new AppError("Booking not found", 404);

  if (booking.customerId.toString() !== customerId) {
    throw new AppError("Access denied", 403);
  }

  if (!canCustomerCancel(booking.status, booking.scheduledAt)) {
    throw new AppError(
      "Cannot cancel: either booking is not cancellable or the 2-hour cutoff has passed",
      400
    );
  }

  booking.status = transition({
    currentStatus: booking.status,
    action: "cancel",
    actor: "customer",
  });

  booking.cancellationReason = data.cancellationReason;
  pushHistory(booking, customerId, data.cancellationReason);
  await booking.save();

  return booking;
};

export const confirmQuotedBooking = async (
  bookingId: string,
  customerId: string
) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new AppError("Booking not found", 404);

  if (booking.customerId.toString() !== customerId) {
    throw new AppError("Access denied", 403);
  }

  booking.status = transition({
    currentStatus: booking.status,
    action: "confirm",
    actor: "customer",
  });

  pushHistory(booking, customerId, "Customer confirmed quoted price");
  await booking.save();

  return booking;
};

// ─── Provider Operations ────────────────────────────────────────────────────

export const getProviderBookings = async (
  providerId: string,
  query: ListQuery
) => {
  const filter: Record<string, any> = { providerId };
  if (query.status) filter.status = query.status;

  const skip = (query.page - 1) * query.limit;
  const [bookings, total] = await Promise.all([
    Booking.find(filter)
      .populate("customerId", "name avatar phone")
      .populate("serviceCategoryId", "name iconUrl")
      .sort({ scheduledAt: 1 })
      .skip(skip)
      .limit(query.limit),
    Booking.countDocuments(filter),
  ]);

  return {
    bookings,
    pagination: {
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    },
  };
};

export const quoteBooking = async (
  bookingId: string,
  providerId: string,
  data: QuoteInput
) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new AppError("Booking not found", 404);

  if (booking.providerId.toString() !== providerId) {
    throw new AppError("Access denied", 403);
  }

  booking.status = transition({
    currentStatus: booking.status,
    action: "quote",
    actor: "provider",
  });

  booking.estimatedPrice = data.estimatedPrice;
  pushHistory(booking, providerId, `Quoted. Estimated price: ₹${data.estimatedPrice}`);
  await booking.save();

  return booking;
};

export const rejectBooking = async (
  bookingId: string,
  providerId: string,
  data: CancelInput
) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new AppError("Booking not found", 404);

  if (booking.providerId.toString() !== providerId) {
    throw new AppError("Access denied", 403);
  }

  booking.status = transition({
    currentStatus: booking.status,
    action: "reject",
    actor: "provider",
  });

  booking.cancellationReason = data.cancellationReason;
  pushHistory(booking, providerId, data.cancellationReason);
  await booking.save();

  return booking;
};

export const startJob = async (bookingId: string, providerId: string) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new AppError("Booking not found", 404);

  if (booking.providerId.toString() !== providerId) {
    throw new AppError("Access denied", 403);
  }

  booking.status = transition({
    currentStatus: booking.status,
    action: "start",
    actor: "provider",
  });

  pushHistory(booking, providerId, "Job started");
  await booking.save();

  return booking;
};

export const completeJob = async (
  bookingId: string,
  providerId: string,
  data: WorkNotesInput,
  files: { before: Express.Multer.File[]; after: Express.Multer.File[] }
) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new AppError("Booking not found", 404);

  if (booking.providerId.toString() !== providerId) {
    throw new AppError("Access denied", 403);
  }

  booking.status = transition({
    currentStatus: booking.status,
    action: "complete",
    actor: "provider",
  });

  if (data.workNotes) booking.workNotes = data.workNotes;
  if (data.finalPrice !== undefined) booking.finalPrice = data.finalPrice;

  // Upload before/after images
  for (const file of files.before) {
    const result = await uploadToCloudinary(file.buffer, "sevasetu/work-before");
    booking.beforeImages.push(result.secure_url);
    booking.beforeImagePublicIds.push(result.public_id);
  }

  for (const file of files.after) {
    const result = await uploadToCloudinary(file.buffer, "sevasetu/work-after");
    booking.afterImages.push(result.secure_url);
    booking.afterImagePublicIds.push(result.public_id);
  }

  pushHistory(booking, providerId, "Job completed");
  await booking.save();

  return booking;
};

export const updateWorkNotes = async (
  bookingId: string,
  providerId: string,
  data: WorkNotesInput,
  files: { before: Express.Multer.File[]; after: Express.Multer.File[] }
) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new AppError("Booking not found", 404);

  if (booking.providerId.toString() !== providerId) {
    throw new AppError("Access denied", 403);
  }

  if (!["confirmed", "in_progress"].includes(booking.status)) {
    throw new AppError("Cannot add notes in current booking status", 400);
  }

  if (data.workNotes) booking.workNotes = data.workNotes;

  for (const file of files.before) {
    const result = await uploadToCloudinary(file.buffer, "sevasetu/work-before");
    booking.beforeImages.push(result.secure_url);
    booking.beforeImagePublicIds.push(result.public_id);
  }

  for (const file of files.after) {
    const result = await uploadToCloudinary(file.buffer, "sevasetu/work-after");
    booking.afterImages.push(result.secure_url);
    booking.afterImagePublicIds.push(result.public_id);
  }

  await booking.save();
  return booking;
};
