import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { customerBookingService, type Booking } from "../services/customer-booking.service";
import { CancelModal } from "./CancelModal";
import { RescheduleModal } from "./RescheduleModal";
import { useSubmitReview } from "@/features/customer/reviews/hooks/useSubmitReview";
import { useState } from "react";

interface Props {
  booking: Booking;
}

export function BookingDetail({ booking }: Props) {
  const queryClient = useQueryClient();
  const confirmMutation = useMutation({
    mutationFn: () => customerBookingService.confirmQuote(booking._id),
    onSuccess: () => {
      toast.success("Quoted price confirmed");
      queryClient.invalidateQueries({ queryKey: ["customer-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["customer-booking", booking._id] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to confirm quote");
    },
  });
  const submitReview = useSubmitReview();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking #{booking._id.slice(-6)}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p className="uppercase text-muted-foreground">Status: {booking.status}</p>
        <p>
          {booking.address.street}, {booking.address.area}, {booking.address.city}
        </p>
        <p>Scheduled: {new Date(booking.scheduledAt).toLocaleString()}</p>
        {booking.estimatedPrice !== undefined && <p>Estimated: ₹{booking.estimatedPrice}</p>}
        {booking.finalPrice !== undefined && <p>Final: ₹{booking.finalPrice}</p>}
        {booking.workNotes && <p>Work Notes: {booking.workNotes}</p>}

        <div className="flex flex-wrap gap-2">
          {(booking.status === "requested" ||
            booking.status === "quoted" ||
            booking.status === "confirmed") && (
            <RescheduleModal bookingId={booking._id} />
          )}
          {(booking.status === "requested" ||
            booking.status === "quoted" ||
            booking.status === "confirmed") && (
            <CancelModal bookingId={booking._id} />
          )}
          {booking.status === "quoted" && (
            <Button
              disabled={confirmMutation.isPending}
              onClick={() => confirmMutation.mutate()}
            >
              {confirmMutation.isPending ? "Confirming..." : "Confirm Quoted Price"}
            </Button>
          )}
        </div>

        {booking.status === "completed" && (
          <div className="space-y-2 rounded-md border p-3">
            <p className="font-medium">Submit review</p>
            <input
              type="number"
              min={1}
              max={5}
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="h-8 w-24 rounded-md border px-2"
            />
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              className="min-h-24 w-full rounded-md border px-3 py-2"
            />
            <Button
              disabled={submitReview.isPending || comment.length < 10}
              onClick={() => submitReview.mutate({ bookingId: booking._id, rating, comment })}
            >
              {submitReview.isPending ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
