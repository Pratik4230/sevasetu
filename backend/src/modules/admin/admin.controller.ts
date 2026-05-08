import type { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/async-handler";
import { sendSuccess } from "../../shared/utils/api-response";
import * as AdminService from "./admin.service";
import { categorySchema } from "../services/service.service";

const parsePagination = (req: Request) => ({
  page: parseInt(req.query.page as string) || 1,
  limit: parseInt(req.query.limit as string) || 20,
});

// ─── Providers ────────────────────────────────────────────────────────────────

export const getPendingProviders = asyncHandler(
  async (req: Request, res: Response) => {
    const { page, limit } = parsePagination(req);
    const result = await AdminService.getPendingProviders(page, limit);
    sendSuccess({ res, message: "Pending providers fetched", data: result });
  }
);

export const approveProvider = asyncHandler(
  async (req: Request, res: Response) => {
    const profile = await AdminService.approveProvider(req.params.id as string);
    sendSuccess({ res, message: "Provider approved", data: profile });
  }
);

export const rejectProvider = asyncHandler(
  async (req: Request, res: Response) => {
    const profile = await AdminService.rejectProvider(
      req.params.id as string,
      req.body.reason
    );
    sendSuccess({ res, message: "Provider rejected", data: profile });
  }
);

// ─── Users ────────────────────────────────────────────────────────────────────

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = parsePagination(req);
  const result = await AdminService.getAllUsers(page, limit);
  sendSuccess({ res, message: "Users fetched", data: result });
});

export const deactivateUser = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await AdminService.deactivateUser(req.params.id as string);
    sendSuccess({ res, message: "User deactivated", data: user });
  }
);

// ─── Categories ───────────────────────────────────────────────────────────────

export const createCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const body = categorySchema.parse(req.body);
    const category = await AdminService.createCategory(body);
    sendSuccess({ res, statusCode: 201, message: "Category created", data: category });
  }
);

export const updateCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const body = categorySchema.partial().parse(req.body);
    const category = await AdminService.updateCategory(req.params.id as string, body);
    sendSuccess({ res, message: "Category updated", data: category });
  }
);

export const deleteCategory = asyncHandler(
  async (req: Request, res: Response) => {
    await AdminService.softDeleteCategory(req.params.id as string);
    sendSuccess({ res, message: "Category deleted" });
  }
);

// ─── Reviews ──────────────────────────────────────────────────────────────────

export const getAllReviews = asyncHandler(
  async (req: Request, res: Response) => {
    const { page, limit } = parsePagination(req);
    const result = await AdminService.getAllReviews(page, limit);
    sendSuccess({ res, message: "Reviews fetched", data: result });
  }
);

export const moderateReview = asyncHandler(
  async (req: Request, res: Response) => {
    const body = AdminService.moderateReviewSchema.parse(req.body);
    const review = await AdminService.moderateReview(req.params.id as string, body);
    sendSuccess({ res, message: "Review moderated", data: review });
  }
);
