import { z } from "zod";
export const reviewBodySchema = z.record(z.string(), z.unknown());
export const reviewRatingBodySchema = z.object({
    orderItemId: z.string().min(1),
    rating: z.number()
});
