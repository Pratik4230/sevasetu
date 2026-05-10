import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { providerBookingService } from "../services/provider-booking.service";

export const useQuoteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, estimatedPrice }: { bookingId: string; estimatedPrice: number }) =>
      providerBookingService.quote(bookingId, estimatedPrice),
    onSuccess: () => {
      toast.success("Quote submitted");
      queryClient.invalidateQueries({ queryKey: ["provider-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["customer-bookings"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to quote booking");
    },
  });
};
