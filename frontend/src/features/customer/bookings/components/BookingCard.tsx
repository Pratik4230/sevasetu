import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Booking } from "../services/customer-booking.service";

interface Props {
  booking: Booking;
}

export function BookingCard({ booking }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          <span>{booking.serviceCategoryId?.name ?? "Service"}</span>
          <span className="text-xs uppercase text-muted-foreground">{booking.status}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>Provider: {booking.providerId?.name ?? "Unknown"}</p>
        <p>
          Address: {booking.address.street}, {booking.address.area}, {booking.address.city}
        </p>
        <p>Scheduled: {new Date(booking.scheduledAt).toLocaleString()}</p>
        {booking.estimatedPrice !== undefined && <p>Estimated: ₹{booking.estimatedPrice}</p>}
        <Button asChild size="sm">
          <Link to={`/customer/bookings/${booking._id}`}>View Details</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
