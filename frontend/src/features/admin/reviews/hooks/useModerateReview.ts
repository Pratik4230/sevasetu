import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminReviewService } from "../services/admin-review.service";

export const useModerateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reviewId,
      isVisible,
      moderationNote,
    }: {
      reviewId: string;
      isVisible: boolean;
      moderationNote?: string;
    }) => adminReviewService.moderate(reviewId, { isVisible, moderationNote }),
    onSuccess: () => {
      toast.success("Review updated");
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? "Failed to moderate review"),
  });
};
