import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { providerBookingService } from "../services/provider-booking.service";

interface Props {
  bookingId: string;
}

export function WorkNotesForm({ bookingId }: Props) {
  const [workNotes, setWorkNotes] = useState("");
  const [before, setBefore] = useState<File[]>([]);
  const [after, setAfter] = useState<File[]>([]);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => providerBookingService.updateNotes(bookingId, { workNotes, before, after }),
    onSuccess: () => {
      toast.success("Work notes updated");
      queryClient.invalidateQueries({ queryKey: ["provider-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["provider-booking", bookingId] });
      setWorkNotes("");
      setBefore([]);
      setAfter([]);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to update notes");
    },
  });

  return (
    <div className="space-y-2 rounded-md border p-3">
      <p className="text-sm font-medium">Work notes</p>
      <textarea
        className="min-h-24 w-full rounded-md border px-3 py-2 text-sm"
        placeholder="Add notes about work done..."
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
      <Button size="sm" disabled={mutation.isPending} onClick={() => mutation.mutate()}>
        {mutation.isPending ? "Saving..." : "Save Notes"}
      </Button>
    </div>
  );
}
