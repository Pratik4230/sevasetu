import { ProviderProfile } from "../providers/provider.model";
import { ServiceCategory } from "../services/category.model";
import { Review } from "../reviews/review.model";
import { User } from "../users/user.model";
import { AppError } from "../../shared/utils/app-error";
import type { CategoryInput } from "../services/service.service";
import { z } from "zod";

// ─── Provider Management ─────────────────────────────────────────────────────

export const getPendingProviders = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const [providers, total] = await Promise.all([
    ProviderProfile.find({ approvalStatus: "pending" })
      .populate("userId", "name email phone createdAt")
      .populate("serviceCategories", "name")
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit),
    ProviderProfile.countDocuments({ approvalStatus: "pending" }),
  ]);
  return { providers, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
};

export const approveProvider = async (providerProfileId: string) => {
  const profile = await ProviderProfile.findByIdAndUpdate(
    providerProfileId,
    { approvalStatus: "approved" },
    { new: true }
  ).populate("userId", "name email");

  if (!profile) throw new AppError("Provider profile not found", 404);
  return profile;
};

export const rejectProvider = async (
  providerProfileId: string,
  reason?: string
) => {
  const profile = await ProviderProfile.findByIdAndUpdate(
    providerProfileId,
    { approvalStatus: "rejected" },
    { new: true }
  ).populate("userId", "name email");

  if (!profile) throw new AppError("Provider profile not found", 404);
  // In a real app: send rejection email with reason here
  return profile;
};

// ─── User Management ─────────────────────────────────────────────────────────

export const getAllUsers = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(),
  ]);
  return { users, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
};

export const deactivateUser = async (userId: string) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { isActive: false },
    { new: true }
  );
  if (!user) throw new AppError("User not found", 404);
  return user;
};

// ─── Category Management ─────────────────────────────────────────────────────

export const createCategory = async (data: CategoryInput) => {
  return ServiceCategory.create(data);
};

export const updateCategory = async (
  id: string,
  data: Partial<CategoryInput>
) => {
  const cat = await ServiceCategory.findByIdAndUpdate(id, data, { new: true });
  if (!cat) throw new AppError("Category not found", 404);
  return cat;
};

export const softDeleteCategory = async (id: string) => {
  const cat = await ServiceCategory.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );
  if (!cat) throw new AppError("Category not found", 404);
  return cat;
};

// ─── Review Moderation ────────────────────────────────────────────────────────

export const moderateReviewSchema = z.object({
  isVisible: z.boolean(),
  moderationNote: z.string().max(500).optional(),
});

export type ModerateReviewInput = z.infer<typeof moderateReviewSchema>;

export const getAllReviews = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const [reviews, total] = await Promise.all([
    Review.find({})
      .populate("customerId", "name email")
      .populate("providerId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Review.countDocuments(),
  ]);
  return { reviews, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
};

export const moderateReview = async (
  reviewId: string,
  data: ModerateReviewInput
) => {
  const review = await Review.findByIdAndUpdate(
    reviewId,
    { isVisible: data.isVisible, moderationNote: data.moderationNote },
    { new: true }
  );
  if (!review) throw new AppError("Review not found", 404);

  // Re-compute provider avg rating after visibility change
  const mongoose = await import("mongoose");
  const aggregation = await Review.aggregate([
    {
      $match: {
        providerId: review.providerId,
        isVisible: true,
      },
    },
    { $group: { _id: null, avgRating: { $avg: "$rating" }, totalReviews: { $sum: 1 } } },
  ]);

  const stats = aggregation[0] ?? { avgRating: 0, totalReviews: 0 };
  const { ProviderProfile } = await import("../providers/provider.model");
  await ProviderProfile.findOneAndUpdate(
    { userId: review.providerId },
    {
      avgRating: Math.round(stats.avgRating * 10) / 10,
      totalReviews: stats.totalReviews,
    }
  );

  return review;
};
