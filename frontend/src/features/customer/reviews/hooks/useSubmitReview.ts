import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { reviewService, type SubmitReviewPayload } from "../services/review.service";

export const useSubmitReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubmitReviewPayload) => reviewService.submit(payload),
    onSuccess: () => {
      toast.success("Review submitted");
      queryClient.invalidateQueries({ queryKey: ["customer-bookings"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to submit review");
    },
  });
};
