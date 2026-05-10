import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCompleteJob } from "../hooks/useCompleteJob";

interface Props {
  bookingId: string;
}

export function CompleteJobForm({ bookingId }: Props) {
  const completeMutation = useCompleteJob();
  const [workNotes, setWorkNotes] = useState("");
  const [finalPrice, setFinalPrice] = useState("");
  const [before, setBefore] = useState<File[]>([]);
  const [after, setAfter] = useState<File[]>([]);

  return (
    <div className="space-y-2 rounded-md border p-3">
      <p className="text-sm font-medium">Complete Job</p>
      <Input
        type="number"
        min={0}
        value={finalPrice}
        onChange={(e) => setFinalPrice(e.target.value)}
        placeholder="Final price"
      />
      <textarea
        className="min-h-24 w-full rounded-md border px-3 py-2 text-sm"
        placeholder="Final notes"
        value={workNotes}
        onChange={(e) => setWorkNotes(e.target.value)}
      />
      <label className="block text-xs text-muted-foreground">Before images</label>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => setBefore(Array.from(e.target.files ?? []))}
      />
      <label className="block text-xs text-muted-foreground">After images</label>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => setAfter(Array.from(e.target.files ?? []))}
      />

      <Button
        size="sm"
        disabled={completeMutation.isPending}
        onClick={() =>
          completeMutation.mutate({
            bookingId,
            workNotes: workNotes || undefined,
            finalPrice: finalPrice ? Number(finalPrice) : undefined,
            before,
            after,
          })
        }
      >
        {completeMutation.isPending ? "Completing..." : "Mark Completed"}
      </Button>
    </div>
  );
}
