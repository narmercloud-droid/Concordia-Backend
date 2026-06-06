import { z } from "zod";
export const courierTrackingEventSchema = z.object({
    orderId: z.string().min(1),
    status: z.string().min(1)
});
export const courierLocationUpdateSchema = z.object({
    lat: z.number(),
    lng: z.number(),
    speed: z.number().optional(),
    heading: z.number().optional(),
    updatedAt: z.string().datetime().optional()
});
