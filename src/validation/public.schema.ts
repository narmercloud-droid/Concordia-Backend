import { z } from "zod";

export const trackingTokenParamSchema = z.object({
  tracking_token: z.string().min(1)
});
