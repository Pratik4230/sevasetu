import mongoose, { Schema, type Document } from "mongoose";
import bcrypt from "bcryptjs";

export type UserRole = "customer" | "provider" | "admin";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  avatarPublicId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["customer", "provider", "admin"],
      required: true,
    },
    phone: { type: String, trim: true },
    avatar: { type: String },
    avatarPublicId: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Never expose passwordHash in JSON responses
userSchema.set("toJSON", {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform: (_doc, ret: any) => {
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  },
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

export const User = mongoose.model<IUser>("User", userSchema);
