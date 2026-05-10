import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { providerBookingService } from "../services/provider-booking.service";

export const useCompleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookingId,
      workNotes,
      finalPrice,
      before,
      after,
    }: {
      bookingId: string;
      workNotes?: string;
      finalPrice?: number;
      before?: File[];
      after?: File[];
    }) => providerBookingService.complete(bookingId, { workNotes, finalPrice, before, after }),
    onSuccess: () => {
      toast.success("Job completed");
      queryClient.invalidateQueries({ queryKey: ["provider-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["customer-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["provider-booking"] });
      queryClient.invalidateQueries({ queryKey: ["customer-booking"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to complete job");
    },
  });
};
