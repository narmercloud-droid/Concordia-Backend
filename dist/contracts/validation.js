import { z } from 'zod';
export const variantSelectionSchema = z.object({
    variantId: z.string(),
    optionId: z.string().optional(),
    quantity: z.number().int().positive().optional().default(1),
});
export const addonSelectionSchema = z.object({
    addonId: z.string(),
    quantity: z.number().int().positive().optional().default(1),
    price: z.number().nonnegative().optional(),
});
export const orderItemSchema = z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
    unitPrice: z.number().nonnegative().optional(),
    variants: z.array(variantSelectionSchema).optional(),
    addons: z.array(addonSelectionSchema).optional(),
    note: z.string().optional(),
});
export const createOrderSchema = z.object({
    customerId: z.string().optional(),
    items: z.array(orderItemSchema).min(1),
    shippingAddress: z.string().optional(),
    billingAddress: z.string().optional(),
    currency: z.string().optional(),
    notes: z.string().optional(),
    total: z.number().nonnegative().optional(),
    metadata: z.record(z.string(), z.any()).optional(),
});
