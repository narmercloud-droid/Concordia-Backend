import { z } from "zod";
const orderItemSchema = z.object({
    itemId: z.string().min(1),
    variantId: z.string().min(1),
    addOnIds: z.array(z.string()).optional(),
    quantity: z.number().min(1),
    notes: z.string().nullable().optional(),
    price: z.number()
});
export const legacyCreateOrderSchema = z
    .object({
    items: z.array(orderItemSchema).min(1),
    paymentMethod: z.string().min(1)
})
    .passthrough();
export const courierOrderActionSchema = z.object({
    orderId: z.string().min(1),
    courierToken: z.string().min(1)
});
export const orderStatusBodySchema = z.object({
    status: z.string().min(1)
});
