import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    items: z.array(z.object({
      itemId: z.string(),
      variantId: z.string(),
      addOnIds: z.array(z.string()),
      quantity: z.number().int().positive(),
      notes: z.string().optional(),
      price: z.number().positive()
    })).min(1),
    paymentMethod: z.enum(["cash", "online"]),
    customerId: z.string().optional(),
    isGuest: z.boolean().optional()
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
      "ready_for_pickup",
      "picked_up",
      "delivered",
      "cancelled",
    ]),
    estimated_time: z.number().optional(),
  }),
});

// NEW — admin can update estimated time
export const updateEstimatedTimeSchema = z.object({
  estimated_time: z.number().min(1),
});
