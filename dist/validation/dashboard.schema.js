import { z } from "zod";
export const dashboardParamsSchema = z.object({
    branchId: z.string().min(1)
});
