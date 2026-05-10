import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminUserService } from "../services/admin-user.service";

export const useDeactivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => adminUserService.deactivate(userId),
    onSuccess: () => {
      toast.success("User deactivated");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? "Failed to deactivate user"),
  });
};
