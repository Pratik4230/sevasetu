import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ModerationReview } from "../services/admin-review.service";
import { useModerateReview } from "../hooks/useModerateReview";

interface Props {
  review: ModerationReview;
}

export function ReviewModerationRow({ review }: Props) {
  const [note, setNote] = useState(review.moderationNote ?? "");
  const mutation = useModerateReview();

  return (
    <tr className="border-b align-top">
      <td className="p-2">{review.customerId.name}</td>
      <td className="p-2">{review.providerId.name}</td>
      <td className="p-2">{review.rating}</td>
      <td className="p-2">{review.comment}</td>
      <td className="p-2">
        <Input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Moderation note"
        />
      </td>
      <td className="p-2">
        <div className="flex gap-2">
          <Button
            size="sm"
            disabled={mutation.isPending}
            onClick={() =>
              mutation.mutate({
                reviewId: review._id,
                isVisible: true,
                moderationNote: note || undefined,
              })
            }
          >
            Show
          </Button>
          <Button
            size="sm"
            variant="destructive"
            disabled={mutation.isPending}
            onClick={() =>
              mutation.mutate({
                reviewId: review._id,
                isVisible: false,
                moderationNote: note || undefined,
              })
            }
          >
            Hide
          </Button>
        </div>
      </td>
    </tr>
  );
}
