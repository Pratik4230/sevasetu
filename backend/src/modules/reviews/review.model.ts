import mongoose, { Schema, type Document } from "mongoose";

export interface IReview extends Document {
  bookingId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  providerId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  isVisible: boolean;
  moderationNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true, // One review per booking
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    providerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, maxlength: 2000 },
    isVisible: { type: Boolean, default: true },
    moderationNote: { type: String },
  },
  { timestamps: true }
);

reviewSchema.index({ providerId: 1, isVisible: 1 });

export const Review = mongoose.model<IReview>("Review", reviewSchema);
