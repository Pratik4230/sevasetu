import type { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/async-handler";
import { sendSuccess } from "../../shared/utils/api-response";
import * as BookingService from "./booking.service";
import {
  createBookingSchema,
  rescheduleSchema,
  cancelSchema,
  workNotesSchema,
  quoteSchema,
  listQuerySchema,
} from "./booking.validation";

const extractBeforeAfterFiles = (
  files: Request["files"]
): { before: Express.Multer.File[]; after: Express.Multer.File[] } => {
  if (!files) {
    return { before: [], after: [] };
  }

  if (Array.isArray(files)) {
    return {
      before: files.filter((f) => f.fieldname === "before"),
      after: files.filter((f) => f.fieldname === "after"),
    };
  }

  const grouped = files as {
    [fieldname: string]: Express.Multer.File[] | undefined;
  };
  return {
    before: grouped.before ?? [],
    after: grouped.after ?? [],
  };
};

// ─── Customer Controllers ────────────────────────────────────────────────────

export const createBooking = asyncHandler(
  async (req: Request, res: Response) => {
    const normalizedBody: Record<string, unknown> = { ...req.body };

    if (
      typeof normalizedBody["address"] === "string" &&
      normalizedBody["address"]
    ) {
      try {
        normalizedBody["address"] = JSON.parse(
          normalizedBody["address"] as string
        );
      } catch {
        // Let zod validation return a structured error below.
      }
    }

    if (
      !normalizedBody["address"] &&
      (normalizedBody["address[street]"] ||
        normalizedBody["address[city]"] ||
        normalizedBody["address[area]"])
    ) {
      normalizedBody["address"] = {
        street: normalizedBody["address[street]"],
        city: normalizedBody["address[city]"],
        area: normalizedBody["address[area]"],
      };
    }

    const body = createBookingSchema.parse(normalizedBody);
    const file = req.file;
    const booking = await BookingService.createBooking(
      req.user!.userId,
      body,
      file
    );
    sendSuccess({ res, statusCode: 201, message: "Booking created", data: booking });
  }
);

export const getMyBookings = asyncHandler(
  async (req: Request, res: Response) => {
    const query = listQuerySchema.parse(req.query);
    const result = await BookingService.getCustomerBookings(
      req.user!.userId,
      query
    );
    sendSuccess({ res, message: "Bookings fetched", data: result });
  }
);

export const getBookingById = asyncHandler(
  async (req: Request, res: Response) => {
    const booking = await BookingService.getBookingById(
      req.params.id as string,
      req.user!.userId
    );
    sendSuccess({ res, message: "Booking fetched", data: booking });
  }
);

export const rescheduleBooking = asyncHandler(
  async (req: Request, res: Response) => {
    const body = rescheduleSchema.parse(req.body);
    const booking = await BookingService.rescheduleBooking(
      req.params.id as string,
      req.user!.userId,
      body
    );
    sendSuccess({ res, message: "Booking rescheduled", data: booking });
  }
);

export const cancelBooking = asyncHandler(
  async (req: Request, res: Response) => {
    const body = cancelSchema.parse(req.body);
    const booking = await BookingService.cancelByCustomer(
      req.params.id as string,
      req.user!.userId,
      body
    );
    sendSuccess({ res, message: "Booking cancelled", data: booking });
  }
);

export const confirmQuotedBooking = asyncHandler(
  async (req: Request, res: Response) => {
    const booking = await BookingService.confirmQuotedBooking(
      req.params.id as string,
      req.user!.userId
    );
    sendSuccess({ res, message: "Quoted booking confirmed", data: booking });
  }
);

// ─── Provider Controllers ────────────────────────────────────────────────────

export const getProviderBookings = asyncHandler(
  async (req: Request, res: Response) => {
    const query = listQuerySchema.parse(req.query);
    const result = await BookingService.getProviderBookings(
      req.user!.userId,
      query
    );
    sendSuccess({ res, message: "Bookings fetched", data: result });
  }
);

export const quoteBooking = asyncHandler(
  async (req: Request, res: Response) => {
    const body = quoteSchema.parse(req.body);
    const booking = await BookingService.quoteBooking(
      req.params.id as string,
      req.user!.userId,
      body
    );
    sendSuccess({ res, message: "Booking quoted", data: booking });
  }
);

export const rejectBooking = asyncHandler(
  async (req: Request, res: Response) => {
    const body = cancelSchema.parse(req.body);
    const booking = await BookingService.rejectBooking(
      req.params.id as string,
      req.user!.userId,
      body
    );
    sendSuccess({ res, message: "Booking rejected", data: booking });
  }
);

export const startJob = asyncHandler(async (req: Request, res: Response) => {
  const booking = await BookingService.startJob(
    req.params.id as string,
    req.user!.userId
  );
  sendSuccess({ res, message: "Job started", data: booking });
});

export const completeJob = asyncHandler(async (req: Request, res: Response) => {
  const body = workNotesSchema.parse(req.body);
  const { before: beforeFiles, after: afterFiles } = extractBeforeAfterFiles(
    req.files
  );

  const booking = await BookingService.completeJob(
    req.params.id as string,
    req.user!.userId,
    body,
    { before: beforeFiles, after: afterFiles }
  );
  sendSuccess({ res, message: "Job completed", data: booking });
});

export const updateWorkNotes = asyncHandler(
  async (req: Request, res: Response) => {
    const body = workNotesSchema.parse(req.body);
    const { before: beforeFiles, after: afterFiles } = extractBeforeAfterFiles(
      req.files
    );

    const booking = await BookingService.updateWorkNotes(
      req.params.id as string,
      req.user!.userId,
      body,
      { before: beforeFiles, after: afterFiles }
    );
    sendSuccess({ res, message: "Work notes updated", data: booking });
  }
);
