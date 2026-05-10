import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { BookingDetail } from "../components/BookingDetail";
import { customerBookingService } from "../services/customer-booking.service";
import { PageHeader } from "@/shared/components/PageHeader";

export function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useQuery({
    queryKey: ["customer-booking", id],
    queryFn: () => customerBookingService.getById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading booking...</div>;
  }

  if (error || !data) {
    return <div className="p-6 text-sm text-red-600">Failed to load booking.</div>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <PageHeader
        title="Booking Details"
        subtitle="Review timeline, pricing, and next actions for this booking."
      />
      <BookingDetail booking={data} />
    </div>
  );
}
