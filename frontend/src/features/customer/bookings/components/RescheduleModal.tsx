import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { customerBookingService } from "../services/customer-booking.service";

interface Props {
  bookingId: string;
}

export function RescheduleModal({ bookingId }: Props) {
  const [open, setOpen] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => customerBookingService.reschedule(bookingId, { scheduledAt }),
    onSuccess: () => {
      toast.success("Booking rescheduled");
      queryClient.invalidateQueries({ queryKey: ["customer-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["customer-booking", bookingId] });
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to reschedule");
    },
  });

  if (!open) {
    return (
      <Button variant="outline" onClick={() => setOpen(true)}>
        Reschedule
      </Button>
    );
  }

  return (
    <div className="space-y-2 rounded-lg border p-3">
      <p className="text-sm font-medium">New date and time</p>
      <input
        type="datetime-local"
        value={scheduledAt}
        onChange={(e) => setScheduledAt(e.target.value)}
        className="h-8 w-full rounded-md border px-2 text-sm"
      />
      <div className="flex gap-2">
        <Button
          disabled={mutation.isPending || !scheduledAt}
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending ? "Saving..." : "Save"}
        </Button>
        <Button variant="outline" onClick={() => setOpen(false)}>
          Close
        </Button>
      </div>
    </div>
  );
}
