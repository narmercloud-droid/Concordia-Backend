import { z } from "zod";

export const createAdminSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.string()
});

export const loginAdminSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export const updateAdminSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.string().optional()
});
