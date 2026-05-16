import { z } from "zod";

export const addressBodySchema = z
  .object({
    label: z.string().optional(),
    street: z.string().min(1),
    city: z.string().min(1),
    postalCode: z.string().min(1),
    lat: z.number().optional(),
    lng: z.number().optional(),
    instructions: z.string().optional(),
    isDefault: z.boolean().optional()
  })
  .passthrough();
