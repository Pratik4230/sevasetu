import type { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/async-handler";
import { sendSuccess } from "../../shared/utils/api-response";
import * as AuthService from "./auth.service";
import { registerSchema, loginSchema } from "./auth.validation";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const body = registerSchema.parse(req.body);
  const { user, token } = await AuthService.register(body);
  sendSuccess({
    res,
    statusCode: 201,
    message: "Registration successful",
    data: { user, token },
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const body = loginSchema.parse(req.body);
  const { user, token } = await AuthService.login(body);
  sendSuccess({ res, message: "Login successful", data: { user, token } });
});

// Logout is client-side (discard JWT), but we acknowledge it
export const logout = asyncHandler(async (_req: Request, res: Response) => {
  sendSuccess({ res, message: "Logged out successfully" });
});
