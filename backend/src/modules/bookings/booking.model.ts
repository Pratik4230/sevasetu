import mongoose, { Schema, type Document } from "mongoose";
import type { BookingStatus } from "./booking.state-machine";

export interface IStatusHistory {
  status: BookingStatus;
  changedAt: Date;
  changedBy: mongoose.Types.ObjectId;
  note?: string;
}

export interface IBooking extends Document {
  customerId: mongoose.Types.ObjectId;
  providerId: mongoose.Types.ObjectId;
  serviceCategoryId: mongoose.Types.ObjectId;

  address: {
    street: string;
    city: string;
    area: string;
  };

  scheduledAt: Date;
  notes?: string;
  attachmentImage?: string;
  attachmentImagePublicId?: string;

  status: BookingStatus;
  statusHistory: IStatusHistory[];

  // Pricing — set by provider
  estimatedPrice?: number;
  finalPrice?: number;

  // Provider work data
  workNotes?: string;
  beforeImages: string[];
  beforeImagePublicIds: string[];
  afterImages: string[];
  afterImagePublicIds: string[];

  cancellationReason?: string;
  rescheduledAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const statusHistorySchema = new Schema<IStatusHistory>(
  {
    status: {
      type: String,
      enum: ["requested", "quoted", "confirmed", "in_progress", "completed", "cancelled"],
      required: true,
    },
    changedAt: { type: Date, default: Date.now },
    changedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    note: { type: String },
  },
  { _id: false }
);

const bookingSchema = new Schema<IBooking>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    providerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    serviceCategoryId: {
      type: Schema.Types.ObjectId,
      ref: "ServiceCategory",
      required: true,
    },

    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      area: { type: String, required: true },
    },

    scheduledAt: { type: Date, required: true },
    notes: { type: String },
    attachmentImage: { type: String },
    attachmentImagePublicId: { type: String },

    status: {
      type: String,
      enum: ["requested", "quoted", "confirmed", "in_progress", "completed", "cancelled"],
      default: "requested",
    },
    statusHistory: [statusHistorySchema],

    estimatedPrice: { type: Number, min: 0 },
    finalPrice: { type: Number, min: 0 },

    workNotes: { type: String },
    beforeImages: [{ type: String }],
    beforeImagePublicIds: [{ type: String }],
    afterImages: [{ type: String }],
    afterImagePublicIds: [{ type: String }],

    cancellationReason: { type: String },
    rescheduledAt: { type: Date },
  },
  { timestamps: true }
);

bookingSchema.index({ customerId: 1, status: 1 });
bookingSchema.index({ providerId: 1, status: 1 });
bookingSchema.index({ scheduledAt: 1 });

export const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
