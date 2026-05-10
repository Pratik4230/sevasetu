import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuoteJob } from "../hooks/useAcceptJob";

interface Props {
  bookingId: string;
}

export function QuoteModal({ bookingId }: Props) {
  const [open, setOpen] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState("");
  const mutation = useQuoteJob();

  if (!open) {
    return (
      <Button size="sm" onClick={() => setOpen(true)}>
        Quote Job
      </Button>
    );
  }

  return (
    <div className="space-y-2 rounded-md border p-3">
      <p className="text-sm font-medium">Set estimated price</p>
      <Input
        type="number"
        min={0}
        value={estimatedPrice}
        onChange={(e) => setEstimatedPrice(e.target.value)}
        placeholder="Estimated price"
      />
      <div className="flex gap-2">
        <Button
          size="sm"
          disabled={mutation.isPending || !estimatedPrice}
          onClick={() =>
            mutation.mutate(
              { bookingId, estimatedPrice: Number(estimatedPrice) },
              { onSuccess: () => setOpen(false) }
            )
          }
        >
          {mutation.isPending ? "Submitting..." : "Submit Quote"}
        </Button>
        <Button size="sm" variant="outline" onClick={() => setOpen(false)}>
          Close
        </Button>
      </div>
    </div>
  );
}
