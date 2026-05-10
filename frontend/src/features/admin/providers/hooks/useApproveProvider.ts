import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminProviderService } from "../services/admin-provider.service";

export const useApproveProvider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ providerProfileId, approve, reason }: { providerProfileId: string; approve: boolean; reason?: string }) =>
      approve
        ? adminProviderService.approve(providerProfileId)
        : adminProviderService.reject(providerProfileId, reason),
    onSuccess: (_, vars) => {
      toast.success(vars.approve ? "Provider approved" : "Provider rejected");
      queryClient.invalidateQueries({ queryKey: ["admin-pending-providers"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Action failed");
    },
  });
};
