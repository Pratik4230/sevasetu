import type { Response } from "express";

interface ApiResponseOptions<T> {
  res: Response;
  statusCode?: number;
  message: string;
  data?: T;
}

export const sendSuccess = <T>({
  res,
  statusCode = 200,
  message,
  data,
}: ApiResponseOptions<T>): void => {
  res.status(statusCode).json({
    success: true,
    message,
    data: data ?? null,
  });
};

export const sendError = (
  res: Response,
  statusCode: number,
  message: string
): void => {
  res.status(statusCode).json({
    success: false,
    message,
    data: null,
  });
};
