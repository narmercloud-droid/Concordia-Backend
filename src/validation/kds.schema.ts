import { z } from "zod";

export const kdsUpdateStatusSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum(["preparing", "ready", "completed"])
});
