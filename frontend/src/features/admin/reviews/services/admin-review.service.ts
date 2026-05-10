import { apiClient } from "@/shared/api/axios.client";
import type { ApiResponse } from "@/shared/types/api.types";

export interface ModerationReview {
  _id: string;
  rating: number;
  comment: string;
  isVisible: boolean;
  moderationNote?: string;
  customerId: { _id: string; name: string; email: string };
  providerId: { _id: string; name: string; email: string };
  createdAt: string;
}

interface ReviewsResponse {
  reviews: ModerationReview[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

export const adminReviewService = {
  getAll: async () => {
    const res = await apiClient.get<ApiResponse<ReviewsResponse>>("/admin/reviews");
    return res.data.data;
  },
  moderate: async (reviewId: string, payload: { isVisible: boolean; moderationNote?: string }) => {
    const res = await apiClient.patch<ApiResponse<ModerationReview>>(
      `/admin/reviews/${reviewId}/moderate`,
      payload
    );
    return res.data.data;
  },
};
