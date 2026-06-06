import { z } from "zod";
export const conversationalTalkBodySchema = z.object({
    message: z.string().min(1)
});
