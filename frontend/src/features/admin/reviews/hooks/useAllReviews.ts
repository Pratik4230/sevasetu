import { useQuery } from "@tanstack/react-query";
import { adminReviewService } from "../services/admin-review.service";

export const useAllReviews = () =>
  useQuery({
    queryKey: ["admin-reviews"],
    queryFn: adminReviewService.getAll,
  });
