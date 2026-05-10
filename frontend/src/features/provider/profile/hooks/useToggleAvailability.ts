import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { providerProfileService } from "../services/provider-profile.service";

export const useToggleAvailability = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: providerProfileService.toggleAvailability,
    onSuccess: () => {
      toast.success("Availability updated");
      queryClient.invalidateQueries({ queryKey: ["provider-profile"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to toggle availability");
    },
  });
};
