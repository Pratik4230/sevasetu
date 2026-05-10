import { apiClient } from "@/shared/api/axios.client";
import type { ApiResponse } from "@/shared/types/api.types";
import type { Booking, BookingStatus } from "@/features/customer/bookings/services/customer-booking.service";

interface PaginatedBookings {
  bookings: Booking[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const providerBookingService = {
  getIncoming: async (status?: BookingStatus) => {
    const res = await apiClient.get<ApiResponse<PaginatedBookings>>("/bookings/provider", {
      params: status ? { status } : undefined,
    });
    return res.data.data;
  },

  getById: async (bookingId: string) => {
    const res = await apiClient.get<ApiResponse<Booking>>(`/bookings/provider/${bookingId}`);
    return res.data.data;
  },

  quote: async (bookingId: string, estimatedPrice: number) => {
    const res = await apiClient.patch<ApiResponse<Booking>>(
      `/bookings/provider/${bookingId}/quote`,
      { estimatedPrice }
    );
    return res.data.data;
  },

  reject: async (bookingId: string, cancellationReason?: string) => {
    const res = await apiClient.patch<ApiResponse<Booking>>(
      `/bookings/provider/${bookingId}/reject`,
      { cancellationReason }
    );
    return res.data.data;
  },

  start: async (bookingId: string) => {
    const res = await apiClient.patch<ApiResponse<Booking>>(
      `/bookings/provider/${bookingId}/start`
    );
    return res.data.data;
  },

  complete: async (bookingId: string, payload: {
    workNotes?: string;
    finalPrice?: number;
    before?: File[];
    after?: File[];
  }) => {
    const form = new FormData();
    if (payload.workNotes) form.append("workNotes", payload.workNotes);
    if (payload.finalPrice !== undefined) {
      form.append("finalPrice", String(payload.finalPrice));
    }
    payload.before?.forEach((file) => form.append("before", file));
    payload.after?.forEach((file) => form.append("after", file));

    const res = await apiClient.patch<ApiResponse<Booking>>(
      `/bookings/provider/${bookingId}/complete`,
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data.data;
  },

  updateNotes: async (bookingId: string, payload: {
    workNotes?: string;
    before?: File[];
    after?: File[];
  }) => {
    const form = new FormData();
    if (payload.workNotes) form.append("workNotes", payload.workNotes);
    payload.before?.forEach((file) => form.append("before", file));
    payload.after?.forEach((file) => form.append("after", file));

    const res = await apiClient.patch<ApiResponse<Booking>>(
      `/bookings/provider/${bookingId}/notes`,
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data.data;
  },
};
