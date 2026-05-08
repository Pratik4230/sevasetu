import type { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/async-handler";
import { sendSuccess } from "../../shared/utils/api-response";
import * as ReviewService from "./review.service";

export const submitReview = asyncHandler(
  async (req: Request, res: Response) => {
    const body = ReviewService.createReviewSchema.parse(req.body);
    const review = await ReviewService.submitReview(req.user!.userId, body);
    sendSuccess({ res, statusCode: 201, message: "Review submitted", data: review });
  }
);

export const getProviderReviews = asyncHandler(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await ReviewService.getProviderReviews(
      req.params.providerId as string,
      page,
      limit
    );
    sendSuccess({ res, message: "Reviews fetched", data: result });
  }
);
