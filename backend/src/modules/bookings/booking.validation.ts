import { z } from "zod";

const addressSchema = z.object({
  street: z.string().min(3),
  city: z.string().min(2),
  area: z.string().min(2),
});

export const createBookingSchema = z.object({
  providerId: z.string(),
  serviceCategoryId: z.string(),
  address: addressSchema,
  scheduledAt: z.coerce.date().refine((d) => d > new Date(), {
    message: "Scheduled time must be in the future",
  }),
  notes: z.string().max(1000).optional(),
  estimatedPrice: z.number().min(0).optional(),
});

export const rescheduleSchema = z.object({
  scheduledAt: z.coerce.date().refine((d) => d > new Date(), {
    message: "New scheduled time must be in the future",
  }),
});

export const cancelSchema = z.object({
  cancellationReason: z.string().min(5).max(500).optional(),
});

export const workNotesSchema = z.object({
  workNotes: z.string().max(2000).optional(),
  finalPrice: z.number().min(0).optional(),
});

export const quoteSchema = z.object({
  estimatedPrice: z.number().min(0),
});

export const listQuerySchema = z.object({
  status: z
    .enum(["requested", "quoted", "confirmed", "in_progress", "completed", "cancelled"])
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type RescheduleInput = z.infer<typeof rescheduleSchema>;
export type CancelInput = z.infer<typeof cancelSchema>;
export type WorkNotesInput = z.infer<typeof workNotesSchema>;
export type QuoteInput = z.infer<typeof quoteSchema>;
export type ListQuery = z.infer<typeof listQuerySchema>;
