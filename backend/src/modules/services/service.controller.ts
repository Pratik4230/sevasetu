import type { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/async-handler";
import { sendSuccess } from "../../shared/utils/api-response";
import * as ServiceService from "./service.service";

export const getAllCategories = asyncHandler(
  async (_req: Request, res: Response) => {
    const categories = await ServiceService.getAllActive();
    sendSuccess({ res, message: "Categories fetched", data: categories });
  }
);

export const getCategoryById = asyncHandler(
  async (req: Request, res: Response) => {
    const category = await ServiceService.getById(req.params.id as string);
    sendSuccess({ res, message: "Category fetched", data: category });
  }
);
