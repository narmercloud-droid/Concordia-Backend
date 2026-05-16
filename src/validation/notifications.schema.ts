import { z } from "zod";

export const notificationPreferencesSchema = z.record(z.string(), z.unknown());

export const marketingSmsSchema = z.object({
  message: z.string().min(1),
  segment: z.enum(["all", "recent"]).or(z.string())
});
