import mongoose, { Schema, type Document } from "mongoose";

export interface IServiceCategory extends Document {
  name: string;
  description: string;
  iconUrl?: string;
  basePrice?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const serviceCategorySchema = new Schema<IServiceCategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    iconUrl: { type: String },
    basePrice: { type: Number, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const ServiceCategory = mongoose.model<IServiceCategory>(
  "ServiceCategory",
  serviceCategorySchema
);
