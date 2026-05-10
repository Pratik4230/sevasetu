import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookingCard } from "../components/BookingCard";
import { useMyBookings } from "../hooks/useMyBookings";
import type { BookingStatus } from "../services/customer-booking.service";
import { PageHeader } from "@/shared/components/PageHeader";

const FILTERS: Array<{ label: string; value?: BookingStatus }> = [
  { label: "All" },
  { label: "Requested", value: "requested" },
  { label: "Quoted", value: "quoted" },
  { label: "Confirmed", value: "confirmed" },
  { label: "In progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export function MyBookingsPage() {
  const [status, setStatus] = useState<BookingStatus | undefined>();
  const { data, isLoading } = useMyBookings(status);

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <PageHeader
        title="My Bookings"
        subtitle="Track every request from quote to completion."
      />
      <div className="flex items-center justify-between">
        <Button asChild>
          <Link to="/customer/bookings/new">New Booking</Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Button
            key={f.label}
            size="sm"
            variant={status === f.value ? "default" : "outline"}
            onClick={() => setStatus(f.value)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading bookings...</p>}
      {!isLoading && data?.bookings.length === 0 && (
        <p className="text-sm text-muted-foreground">No bookings found.</p>
      )}
      <div className="grid grid-cols-1 gap-3">
        {data?.bookings.map((booking) => (
          <BookingCard key={booking._id} booking={booking} />
        ))}
      </div>
    </div>
  );
}
