import { z } from "zod";

export const cartAddItemSchema = z.object({
  itemId: z.string().min(1),
  quantity: z.number().int().min(1)
});

export const cartQuantitySchema = z.object({
  quantity: z.number().int().min(1)
});

export const cartLoadQuerySchema = z.object({
  cartId: z.string().optional()
});

export const cartCheckoutBodySchema = z.record(z.string(), z.unknown());

export const cartIdParamSchema = z.object({
  cartId: z.string().min(1)
});

export const cartItemIdParamSchema = z.object({
  cartItemId: z.string().min(1)
});
