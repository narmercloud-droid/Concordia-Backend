import { z } from "zod";

export const nlaeAskSchema = z.object({
  question: z.string().min(1)
});
