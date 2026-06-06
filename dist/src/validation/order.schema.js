import { z } from "zod";
export const kitchenCreateOrderSchema = z.object({
    items: z
        .array(z.object({
        itemId: z.string().min(1),
        variantId: z.string().min(1),
        addOnIds: z.array(z.string()).optional(),
        quantity: z.number().min(1),
        notes: z.string().optional(),
        price: z.number()
    }))
        .min(1),
    paymentMethod: z.string().min(1),
    customerId: z.string().optional(),
    isGuest: z.boolean().optional()
});
export const kitchenUpdateStatusSchema = z.object({
    status: z.string().min(1),
    estimated_time: z.number().optional()
});
