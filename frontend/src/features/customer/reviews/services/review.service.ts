import { apiClient } from "@/shared/api/axios.client";
import type { ApiResponse } from "@/shared/types/api.types";

export interface SubmitReviewPayload {
  bookingId: string;
  rating: number;
  comment: string;
}

export const reviewService = {
  submit: async (payload: SubmitReviewPayload) => {
    const res = await apiClient.post<ApiResponse<any>>("/reviews", payload);
    return res.data.data;
  },
};
