import { z } from "zod";

export const assignOrderSchema = z.object({
  params: z.object({
    order_id: z.string(),
  }),
});

export const acceptOrderSchema = z.object({
  params: z.object({
    order_id: z.string(),
  }),
});

export const rejectOrderSchema = z.object({
  params: z.object({
    order_id: z.string(),
  }),
});
