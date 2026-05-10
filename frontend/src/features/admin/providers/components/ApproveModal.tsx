import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApproveProvider } from "../hooks/useApproveProvider";

interface Props {
  providerProfileId: string;
}

export function ApproveModal({ providerProfileId }: Props) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const mutation = useApproveProvider();

  if (!open) {
    return (
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        Review
      </Button>
    );
  }

  return (
    <div className="space-y-2 rounded-md border p-3">
      <Input
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Rejection reason (optional)"
      />
      <div className="flex gap-2">
        <Button
          size="sm"
          disabled={mutation.isPending}
          onClick={() =>
            mutation.mutate(
              { providerProfileId, approve: true },
              { onSuccess: () => setOpen(false) }
            )
          }
        >
          Approve
        </Button>
        <Button
          size="sm"
          variant="destructive"
          disabled={mutation.isPending}
          onClick={() =>
            mutation.mutate(
              { providerProfileId, approve: false, reason: reason || undefined },
              { onSuccess: () => setOpen(false) }
            )
          }
        >
          Reject
        </Button>
        <Button size="sm" variant="outline" onClick={() => setOpen(false)}>
          Close
        </Button>
      </div>
    </div>
  );
}
