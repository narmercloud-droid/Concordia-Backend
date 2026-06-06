import { z } from "zod";
export const fraudScoreOrderBodySchema = z.object({
    orderId: z.string().min(1)
});
