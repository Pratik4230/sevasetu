import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error";

type Role = "customer" | "provider" | "admin";

/**
 * Usage: router.use(requireRole("admin"))
 *        router.patch("/...", requireRole("provider"), controller)
 */
export const requireRole =
  (...roles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError("Not authenticated", 401));
    }
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `Access denied. Required role: ${roles.join(" or ")}`,
          403
        )
      );
    }
    next();
  };
