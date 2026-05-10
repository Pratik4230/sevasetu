import { useState } from "react";
import type { BookingStatus } from "@/features/customer/bookings/services/customer-booking.service";
import { useIncomingJobs } from "../hooks/useIncomingJobs";
import { JobCard } from "../components/JobCard";
import { Button } from "@/components/ui/button";
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

export function IncomingJobsPage() {
  const [status, setStatus] = useState<BookingStatus | undefined>();
  const { data, isLoading } = useIncomingJobs(status);

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <PageHeader
        title="Incoming Jobs"
        subtitle="Manage requests, quotes, and live work updates from one dashboard."
      />
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

      {isLoading && <p className="text-sm text-muted-foreground">Loading jobs...</p>}
      {!isLoading && data?.bookings.length === 0 && (
        <p className="text-sm text-muted-foreground">No jobs found.</p>
      )}
      <div className="grid grid-cols-1 gap-3">
        {data?.bookings.map((booking) => (
          <JobCard key={booking._id} booking={booking} />
        ))}
      </div>
    </div>
  );
}
