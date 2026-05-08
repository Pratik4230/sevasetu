import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2).max(60),
  email: z.email(),
  password: z.string().min(6),
  role: z.enum(["customer", "provider"]),
  phone: z.string().min(10).max(15).optional(),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
