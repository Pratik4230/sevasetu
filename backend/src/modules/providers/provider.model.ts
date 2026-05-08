import mongoose, { Schema, type Document } from "mongoose";

export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface IProviderProfile extends Document {
  userId: mongoose.Types.ObjectId;
  bio: string;
  serviceCategories: mongoose.Types.ObjectId[];
  city: string;
  area: string;
  experienceYears: number;
  isAvailable: boolean;
  approvalStatus: ApprovalStatus;
  documents: string[];      // Cloudinary URLs
  documentPublicIds: string[];
  avgRating: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

const providerProfileSchema = new Schema<IProviderProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    bio: { type: String, required: true, maxlength: 1000 },
    serviceCategories: [
      { type: Schema.Types.ObjectId, ref: "ServiceCategory" },
    ],
    city: { type: String, required: true, trim: true },
    area: { type: String, required: true, trim: true },
    experienceYears: { type: Number, default: 0, min: 0 },
    isAvailable: { type: Boolean, default: false },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    documents: [{ type: String }],
    documentPublicIds: [{ type: String }],
    avgRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

// Index for city/area filtering
providerProfileSchema.index({ city: 1, area: 1 });
providerProfileSchema.index({ approvalStatus: 1, isAvailable: 1 });

export const ProviderProfile = mongoose.model<IProviderProfile>(
  "ProviderProfile",
  providerProfileSchema
);
