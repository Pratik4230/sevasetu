import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { customerBookingService } from "../services/customer-booking.service";

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookingId,
      cancellationReason,
    }: {
      bookingId: string;
      cancellationReason?: string;
    }) =>
      customerBookingService.cancel(bookingId, {
        cancellationReason,
      }),
    onSuccess: () => {
      toast.success("Booking cancelled");
      queryClient.invalidateQueries({ queryKey: ["customer-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["customer-booking"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to cancel booking");
    },
  });
};
