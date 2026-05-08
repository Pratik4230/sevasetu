import { z } from "zod";

export const createProfileSchema = z.object({
  bio: z.string().min(10).max(1000),
  serviceCategories: z.array(z.string()).min(1),
  city: z.string().min(2),
  area: z.string().min(2),
  experienceYears: z.number().min(0).optional(),
});

export const updateProfileSchema = z.object({
  bio: z.string().min(10).max(1000).optional(),
  serviceCategories: z.array(z.string()).optional(),
  city: z.string().min(2).optional(),
  area: z.string().min(2).optional(),
  experienceYears: z.number().min(0).optional(),
});

export const browseQuerySchema = z.object({
  city: z.string().optional(),
  area: z.string().optional(),
  categoryId: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export type CreateProfileInput = z.infer<typeof createProfileSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type BrowseQuery = z.infer<typeof browseQuerySchema>;
