import { z } from "zod";

export const providerProfileSchema = z.object({
  bio: z.string().min(10, "Bio must be at least 10 characters").max(1000),
  city: z.string().min(2, "City is required"),
  area: z.string().min(2, "Area is required"),
  experienceYears: z.coerce.number().min(0, "Experience cannot be negative"),
  serviceCategories: z
    .array(z.string())
    .min(1, "Select at least one service category"),
});

export type ProviderProfileInput = z.input<typeof providerProfileSchema>;
export type ProviderProfilePayload = z.output<typeof providerProfileSchema>;
