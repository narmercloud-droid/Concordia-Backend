import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    cartId: z.string(),
    branch_id: z.number().int().positive(),
  }),
});

export const updateOrderStatusSchema = z.object({
  params: z.object({
    orderId: z.string(),
  }),
  body: z.object({
    status: z.enum([
      "pending",
      "accepted",
      "preparing",
      "ready",
      "delivered",
    ]),
    estimated_time: z.number().optional(),
  }),
});

// NEW — admin can update estimated time
export const updateEstimatedTimeSchema = z.object({
  estimated_time: z.number().min(1),
});
