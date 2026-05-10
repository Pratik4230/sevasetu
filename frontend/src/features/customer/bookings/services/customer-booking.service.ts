import { apiClient } from "@/shared/api/axios.client";
import type { ApiResponse } from "@/shared/types/api.types";
import type { CreateBookingInput } from "../schemas/create-booking.schema";

export type BookingStatus =
  | "requested"
  | "quoted"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface Booking {
  _id: string;
  providerId: {
    _id: string;
    name: string;
    avatar?: string;
    phone?: string;
  };
  customerId: string;
  serviceCategoryId: {
    _id: string;
    name: string;
    iconUrl?: string;
  };
  address: {
    street: string;
    city: string;
    area: string;
  };
  scheduledAt: string;
  rescheduledAt?: string;
  notes?: string;
  status: BookingStatus;
  estimatedPrice?: number;
  finalPrice?: number;
  workNotes?: string;
  beforeImages: string[];
  afterImages: string[];
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginatedBookings {
  bookings: Booking[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ReschedulePayload {
  scheduledAt: string;
}

export interface CancelPayload {
  cancellationReason?: string;
}

export const customerBookingService = {
  create: async (payload: CreateBookingInput, file?: File) => {
    const form = new FormData();
    form.append("providerId", payload.providerId);
    form.append("serviceCategoryId", payload.serviceCategoryId);
    form.append("address[street]", payload.address.street);
    form.append("address[city]", payload.address.city);
    form.append("address[area]", payload.address.area);
    form.append("scheduledAt", payload.scheduledAt);
    if (payload.notes) form.append("notes", payload.notes);
    if (file) form.append("attachment", file);

    const res = await apiClient.post<ApiResponse<Booking>>("/bookings/customer", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },

  getMyBookings: async (status?: BookingStatus) => {
    const res = await apiClient.get<ApiResponse<PaginatedBookings>>("/bookings/customer", {
      params: status ? { status } : undefined,
    });
    return res.data.data;
  },

  getById: async (bookingId: string) => {
    const res = await apiClient.get<ApiResponse<Booking>>(`/bookings/customer/${bookingId}`);
    return res.data.data;
  },

  reschedule: async (bookingId: string, payload: ReschedulePayload) => {
    const res = await apiClient.patch<ApiResponse<Booking>>(
      `/bookings/customer/${bookingId}/reschedule`,
      payload
    );
    return res.data.data;
  },

  cancel: async (bookingId: string, payload: CancelPayload) => {
    const res = await apiClient.patch<ApiResponse<Booking>>(
      `/bookings/customer/${bookingId}/cancel`,
      payload
    );
    return res.data.data;
  },

  confirmQuote: async (bookingId: string) => {
    const res = await apiClient.patch<ApiResponse<Booking>>(
      `/bookings/customer/${bookingId}/confirm`
    );
    return res.data.data;
  },
};
