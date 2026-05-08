import type { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/async-handler";
import { sendSuccess } from "../../shared/utils/api-response";
import * as ProviderService from "./provider.service";
import {
  createProfileSchema,
  updateProfileSchema,
  browseQuerySchema,
} from "./provider.validation";

export const createProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const body = createProfileSchema.parse(req.body);
    const files = (req.files as Express.Multer.File[]) ?? [];
    const profile = await ProviderService.createProfile(
      req.user!.userId,
      body,
      files
    );
    sendSuccess({ res, statusCode: 201, message: "Profile created", data: profile });
  }
);

export const getMyProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const profile = await ProviderService.getMyProfile(req.user!.userId);
    sendSuccess({ res, message: "Profile fetched", data: profile });
  }
);

export const updateProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const body = updateProfileSchema.parse(req.body);
    const profile = await ProviderService.updateProfile(req.user!.userId, body);
    sendSuccess({ res, message: "Profile updated", data: profile });
  }
);

export const toggleAvailability = asyncHandler(
  async (req: Request, res: Response) => {
    const profile = await ProviderService.toggleAvailability(req.user!.userId);
    sendSuccess({
      res,
      message: `Availability set to ${profile.isAvailable ? "available" : "unavailable"}`,
      data: { isAvailable: profile.isAvailable },
    });
  }
);

export const browseProviders = asyncHandler(
  async (req: Request, res: Response) => {
    const query = browseQuerySchema.parse(req.query);
    const result = await ProviderService.browse(query);
    sendSuccess({ res, message: "Providers fetched", data: result });
  }
);

export const getProviderById = asyncHandler(
  async (req: Request, res: Response) => {
    const profile = await ProviderService.getById(req.params.id as string);
    sendSuccess({ res, message: "Provider fetched", data: profile });
  }
);
