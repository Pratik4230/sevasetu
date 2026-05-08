import { Review } from "./review.model";
import { Booking } from "../bookings/booking.model";
import { ProviderProfile } from "../providers/provider.model";
import { AppError } from "../../shared/utils/app-error";
import { z } from "zod";

export const createReviewSchema = z.object({
  bookingId: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(10).max(2000),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;

export const submitReview = async (
  customerId: string,
  data: CreateReviewInput
) => {
  // Verify booking exists and is completed
  const booking = await Booking.findById(data.bookingId);
  if (!booking) throw new AppError("Booking not found", 404);

  if (booking.customerId.toString() !== customerId) {
    throw new AppError("You can only review your own bookings", 403);
  }

  if (booking.status !== "completed") {
    throw new AppError("You can only review completed bookings", 400);
  }

  // Prevent duplicate review
  const existing = await Review.findOne({ bookingId: data.bookingId });
  if (existing) throw new AppError("You have already reviewed this booking", 409);

  const review = await Review.create({
    bookingId: data.bookingId,
    customerId,
    providerId: booking.providerId,
    rating: data.rating,
    comment: data.comment,
  });

  // Update provider's average rating atomically
  await updateProviderRating(booking.providerId.toString());

  return review;
};

const updateProviderRating = async (providerUserId: string) => {
  const result = await Review.aggregate([
    {
      $match: {
        providerId: new (await import("mongoose")).default.Types.ObjectId(
          providerUserId
        ),
        isVisible: true,
      },
    },
    {
      $group: {
        _id: null,
        avgRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  const stats = result[0] ?? { avgRating: 0, totalReviews: 0 };

  await ProviderProfile.findOneAndUpdate(
    { userId: providerUserId },
    {
      avgRating: Math.round(stats.avgRating * 10) / 10,
      totalReviews: stats.totalReviews,
    }
  );
};

export const getProviderReviews = async (
  providerUserId: string,
  page = 1,
  limit = 10
) => {
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    Review.find({ providerId: providerUserId, isVisible: true })
      .populate("customerId", "name avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Review.countDocuments({ providerId: providerUserId, isVisible: true }),
  ]);

  return {
    reviews,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};
