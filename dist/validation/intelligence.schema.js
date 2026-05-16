import { z } from "zod";
export const itemIdBodySchema = z.object({
    itemId: z.string().min(1)
});
export const branchScopedBodySchema = z.record(z.string(), z.unknown());
export const orchestrationEventBodySchema = z.object({
    event: z.string().min(1)
});
