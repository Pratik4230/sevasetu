import type { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/async-handler";
import { sendSuccess } from "../../shared/utils/api-response";
import * as UserService from "./user.service";
import { updateProfileSchema, changePasswordSchema } from "./user.validation";

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await UserService.findById(req.user!.userId);
  sendSuccess({ res, message: "Profile fetched", data: user });
});

export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const body = updateProfileSchema.parse(req.body);
  const file = req.file;
  const user = await UserService.updateProfile(req.user!.userId, body, file);
  sendSuccess({ res, message: "Profile updated", data: user });
});

export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const body = changePasswordSchema.parse(req.body);
    await UserService.changePassword(req.user!.userId, body);
    sendSuccess({ res, message: "Password changed successfully" });
  }
);
