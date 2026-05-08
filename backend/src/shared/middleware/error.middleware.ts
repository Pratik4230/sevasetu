import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error";
import { env } from "../config/env";

export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Operational errors (thrown by us with AppError)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      data: null,
    });
    return;
  }

  // Mongoose duplicate key error
  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue ?? {})[0] ?? "field";
    res.status(409).json({
      success: false,
      message: `${field} already exists`,
      data: null,
    });
    return;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values((err as any).errors).map(
      (e: any) => e.message
    );
    res.status(400).json({
      success: false,
      message: messages.join(", "),
      data: null,
    });
    return;
  }

  // Zod validation error (from middleware)
  if (err.name === "ZodError") {
    const zodIssues = (err as any).issues ?? (err as any).errors ?? [];
    const firstIssueMessage =
      Array.isArray(zodIssues) && zodIssues[0]?.message
        ? zodIssues[0].message
        : "Validation failed";

    res.status(400).json({
      success: false,
      message: firstIssueMessage,
      data: zodIssues,
    });
    return;
  }

  // Unknown / programming errors
  console.error("❌ Unhandled error:", err);
  res.status(500).json({
    success: false,
    message:
      env.NODE_ENV === "production" ? "Something went wrong" : err.message,
    data: null,
  });
};
