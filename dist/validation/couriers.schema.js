import { z } from "zod";
export const couriersBodySchema = z.record(z.string(), z.unknown());
export const courierStatusUpdateSchema = z.object({
    orderId: z.string().min(1),
    courierToken: z.string().min(1),
    status: z.string().min(1)
});
