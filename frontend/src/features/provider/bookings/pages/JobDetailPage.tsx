import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { providerBookingService } from "../services/provider-booking.service";
import { toast } from "sonner";
import { WorkNotesForm } from "../components/WorkNotesForm";
import { CompleteJobForm } from "../components/CompleteJobForm";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/shared/components/PageHeader";

export function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["provider-booking", id],
    queryFn: () => providerBookingService.getById(id!),
    enabled: !!id,
  });

  const startMutation = useMutation({
    mutationFn: () => providerBookingService.start(id!),
    onSuccess: () => {
      toast.success("Job started");
      queryClient.invalidateQueries({ queryKey: ["provider-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["provider-booking", id] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "Failed to start job"),
  });

  if (isLoading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading job...</div>;
  }
  if (error || !data) {
    return <div className="p-6 text-sm text-red-600">Failed to load job.</div>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <PageHeader
        title={`Job #${data._id.slice(-6)}`}
        subtitle="Track job progress, update notes, and close with confidence."
      />
      <Card className="border-emerald-200/80 bg-white/90">
        <CardContent className="space-y-2 pt-4">
          <p className="text-xs uppercase text-muted-foreground">Status: {data.status}</p>
          <p className="text-sm">
            Address: {data.address.street}, {data.address.area}, {data.address.city}
          </p>
          <p className="text-sm">Scheduled: {new Date(data.scheduledAt).toLocaleString()}</p>
          {data.estimatedPrice !== undefined && (
            <p className="text-sm">Estimated: ₹{data.estimatedPrice}</p>
          )}
        </CardContent>
      </Card>

      {data.status === "confirmed" && (
        <Button disabled={startMutation.isPending} onClick={() => startMutation.mutate()}>
          {startMutation.isPending ? "Starting..." : "Start Job"}
        </Button>
      )}

      {(data.status === "confirmed" || data.status === "in_progress") && (
        <WorkNotesForm bookingId={data._id} />
      )}

      {data.status === "in_progress" && <CompleteJobForm bookingId={data._id} />}
    </div>
  );
}
