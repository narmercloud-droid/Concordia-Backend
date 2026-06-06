import { z } from "zod";
/** First string from Express `req.query` values (`string | string[] | undefined`). */
export const queryStringOptional = z.preprocess((v) => {
    if (v === undefined || v === null || v === "")
        return undefined;
    if (Array.isArray(v))
        return typeof v[0] === "string" ? v[0] : undefined;
    return typeof v === "string" ? v : undefined;
}, z.string().optional());
export const idParamSchema = z.object({
    id: z.string().min(1)
});
export const orderIdParamSchema = z.object({
    orderId: z.string().min(1)
});
export const branchIdParamSchema = z.object({
    branchId: z.string().min(1)
});
export const driverIdParamSchema = z.object({
    driverId: z.string().min(1)
});
export const itemIdParamSchema = z.object({
    itemId: z.string().min(1)
});
export const reviewIdParamSchema = z.object({
    reviewId: z.string().min(1)
});
export const customerIdParamSchema = z.object({
    customerId: z.string().min(1)
});
