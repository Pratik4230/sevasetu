import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Booking } from "@/features/customer/bookings/services/customer-booking.service";
import { QuoteModal } from "./AcceptModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { providerBookingService } from "../services/provider-booking.service";
import { toast } from "sonner";

interface Props {
  booking: Booking;
}

export function JobCard({ booking }: Props) {
  const queryClient = useQueryClient();
  const rejectMutation = useMutation({
    mutationFn: () => providerBookingService.reject(booking._id, "Rejected by provider"),
    onSuccess: () => {
      toast.success("Booking rejected");
      queryClient.invalidateQueries({ queryKey: ["provider-bookings"] });
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? "Failed to reject booking"),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          <span>{booking.serviceCategoryId?.name ?? "Service"}</span>
          <span className="text-xs uppercase text-muted-foreground">{booking.status}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>Customer: {(booking as any).customerId?.name ?? "Customer"}</p>
        <p>
          Address: {booking.address.street}, {booking.address.area}, {booking.address.city}
        </p>
        <p>Scheduled: {new Date(booking.scheduledAt).toLocaleString()}</p>
        {booking.estimatedPrice !== undefined && <p>Estimated: ₹{booking.estimatedPrice}</p>}
        <div className="flex flex-wrap gap-2">
          {booking.status === "requested" && <QuoteModal bookingId={booking._id} />}
          {booking.status === "requested" && (
            <Button
              size="sm"
              variant="outline"
              disabled={rejectMutation.isPending}
              onClick={() => rejectMutation.mutate()}
            >
              {rejectMutation.isPending ? "Rejecting..." : "Reject"}
            </Button>
          )}
          <Button asChild size="sm" variant="outline">
            <Link to={`/provider/jobs/${booking._id}`}>Open</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
