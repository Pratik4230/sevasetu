import bcrypt from "bcryptjs";
import { User } from "../users/user.model";
import { AppError } from "../../shared/utils/app-error";
import { signToken } from "../../shared/utils/jwt.utils";
import type { RegisterInput, LoginInput } from "./auth.validation";

export const register = async (data: RegisterInput) => {
  const existing = await User.findOne({ email: data.email });
  if (existing) throw new AppError("Email already in use", 409);

  const passwordHash = await bcrypt.hash(data.password, 12);

  const user = await User.create({
    name: data.name,
    email: data.email,
    passwordHash,
    role: data.role,
    phone: data.phone,
  });

  const token = signToken({ userId: String(user._id), role: user.role });

  return { user, token };
};

export const login = async (data: LoginInput) => {
  // Need passwordHash for comparison
  const user = await User.findOne({ email: data.email }).select("+passwordHash");
  if (!user) throw new AppError("Invalid email or password", 401);
  if (!user.isActive) throw new AppError("Account is deactivated", 403);

  const isMatch = await user.comparePassword(data.password);
  if (!isMatch) throw new AppError("Invalid email or password", 401);

  const token = signToken({ userId: String(user._id), role: user.role });

  return { user, token };
};
