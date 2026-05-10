import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1)
});

export const createMenuItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().min(0),
  categoryId: z.string(),
  available: z.boolean().default(true)
});

export const updateMenuItemSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.number().min(0).optional(),
  available: z.boolean().optional()
});
