import { useQuery } from "@tanstack/react-query";
import { providerBookingService } from "../services/provider-booking.service";
import type { BookingStatus } from "@/features/customer/bookings/services/customer-booking.service";

export const useIncomingJobs = (status?: BookingStatus) =>
  useQuery({
    queryKey: ["provider-bookings", status ?? "all"],
    queryFn: () => providerBookingService.getIncoming(status),
  });
