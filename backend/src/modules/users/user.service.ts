import { User } from "./user.model";
import { AppError } from "../../shared/utils/app-error";
import { uploadToCloudinary } from "../../shared/utils/cloudinary.utils";
import bcrypt from "bcryptjs";
import type { UpdateProfileInput, ChangePasswordInput } from "./user.validation";

export const findById = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);
  return user;
};

export const updateProfile = async (
  userId: string,
  data: UpdateProfileInput,
  file?: Express.Multer.File
) => {
  const user = await findById(userId);

  if (data.name) user.name = data.name;
  if (data.phone) user.phone = data.phone;

  if (file) {
    const result = await uploadToCloudinary(file.buffer, "sevasetu/avatars");
    user.avatar = result.secure_url;
    user.avatarPublicId = result.public_id;
  }

  await user.save();
  return user;
};

export const changePassword = async (
  userId: string,
  data: ChangePasswordInput
) => {
  const user = await User.findById(userId).select("+passwordHash");
  if (!user) throw new AppError("User not found", 404);

  const isMatch = await user.comparePassword(data.currentPassword);
  if (!isMatch) throw new AppError("Current password is incorrect", 400);

  user.passwordHash = await bcrypt.hash(data.newPassword, 12);
  await user.save();
};
