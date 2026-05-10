import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { providerProfileService } from "../services/provider-profile.service";
import { getErrorMessage } from "@/shared/utils/error";

export const useProviderProfile = () =>
  useQuery({
    queryKey: ["provider-profile"],
    queryFn: providerProfileService.getMyProfile,
    retry: false,
  });

export const useUpsertProviderProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      bio: string;
      city: string;
      area: string;
      experienceYears?: number;
      serviceCategories: string[];
      createMode: boolean;
    }) => {
      if (payload.createMode) {
        return providerProfileService.createProfile(payload);
      }
      return providerProfileService.updateProfile(payload);
    },
    onSuccess: () => {
      toast.success("Provider profile saved");
      queryClient.invalidateQueries({ queryKey: ["provider-profile"] });
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error, "Failed to save provider profile"));
    },
  });
};
