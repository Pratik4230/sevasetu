import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.utils";
import { AppError } from "../utils/app-error";

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(new AppError("Authentication token missing", 401));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch {
    next(new AppError("Invalid or expired token", 401));
  }
};
