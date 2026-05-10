import { z } from "zod";

export const createBookingSchema = z.object({
  providerId: z.string().min(1, "Provider is required"),
  serviceCategoryId: z.string().min(1, "Service category is required"),
  address: z.object({
    street: z.string().min(3, "Street is required"),
    city: z.string().min(2, "City is required"),
    area: z.string().min(2, "Area is required"),
  }),
  scheduledAt: z.string().min(1, "Date and time is required"),
  notes: z.string().max(1000).optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
