import { z } from "zod";

export const loginKDSSchema = z.object({
  body: z.object({
    kds_token: z.string(),
  }),
});