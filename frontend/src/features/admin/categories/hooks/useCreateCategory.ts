import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  adminCategoryService,
  type UpsertCategoryPayload,
} from "../services/admin-category.service";

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpsertCategoryPayload) =>
      adminCategoryService.createCategory(payload),
    onSuccess: () => {
      toast.success("Category created");
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to create category");
    },
  });
};
