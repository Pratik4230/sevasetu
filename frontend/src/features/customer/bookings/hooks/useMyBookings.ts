import { useQuery } from "@tanstack/react-query";
import {
  customerBookingService,
  type BookingStatus,
} from "../services/customer-booking.service";

export const useMyBookings = (status?: BookingStatus) =>
  useQuery({
    queryKey: ["customer-bookings", status ?? "all"],
    queryFn: () => customerBookingService.getMyBookings(status),
  });
