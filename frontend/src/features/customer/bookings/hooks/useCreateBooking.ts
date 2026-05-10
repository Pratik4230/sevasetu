import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  customerBookingService,
  type Booking,
} from "../services/customer-booking.service";
import type { CreateBookingInput } from "../schemas/create-booking.schema";
import { getErrorMessage } from "@/shared/utils/error";

interface CreateBookingPayload {
  data: CreateBookingInput;
  file?: File;
}

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation<Booking, Error, CreateBookingPayload>({
    mutationFn: ({ data, file }) => customerBookingService.create(data, file),
    onSuccess: () => {
      toast.success("Booking request created");
      queryClient.invalidateQueries({ queryKey: ["customer-bookings"] });
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error, "Failed to create booking"));
    },
  });
};
