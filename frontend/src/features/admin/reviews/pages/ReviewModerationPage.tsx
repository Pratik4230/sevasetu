import { ReviewModerationRow } from "../components/ReviewModerationRow";
import { useAllReviews } from "../hooks/useAllReviews";
import { PageHeader } from "@/shared/components/PageHeader";

export function ReviewModerationPage() {
  const { data, isLoading } = useAllReviews();

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <PageHeader
        title="Review Moderation"
        subtitle="Protect trust by managing customer feedback visibility and compliance."
      />
      {isLoading && <p className="text-sm text-muted-foreground">Loading reviews...</p>}
      {!isLoading && data?.reviews.length === 0 && (
        <p className="text-sm text-muted-foreground">No reviews available.</p>
      )}
      {!!data?.reviews.length && (
        <div className="rounded-xl border border-emerald-200/70 bg-white/90 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="p-2">Customer</th>
                <th className="p-2">Provider</th>
                <th className="p-2">Rating</th>
                <th className="p-2">Comment</th>
                <th className="p-2">Note</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.reviews.map((review) => (
                <ReviewModerationRow key={review._id} review={review} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
