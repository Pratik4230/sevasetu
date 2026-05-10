import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCancelBooking } from "../hooks/useCancelBooking";

interface Props {
  bookingId: string;
}

export function CancelModal({ bookingId }: Props) {
  const [reason, setReason] = useState("");
  const [open, setOpen] = useState(false);
  const cancelMutation = useCancelBooking();

  if (!open) {
    return (
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Cancel Booking
      </Button>
    );
  }

  return (
    <div className="space-y-2 rounded-lg border p-3">
      <p className="text-sm font-medium">Cancellation reason (optional)</p>
      <Input
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Change of plan, emergency, etc."
      />
      <div className="flex gap-2">
        <Button
          variant="destructive"
          disabled={cancelMutation.isPending}
          onClick={() =>
            cancelMutation.mutate(
              { bookingId, cancellationReason: reason || undefined },
              { onSuccess: () => setOpen(false) }
            )
          }
        >
          {cancelMutation.isPending ? "Cancelling..." : "Confirm Cancel"}
        </Button>
        <Button variant="outline" onClick={() => setOpen(false)}>
          Close
        </Button>
      </div>
    </div>
  );
}
