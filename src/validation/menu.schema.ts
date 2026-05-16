import { z } from "zod";

export const menuQuerySchema = z.object({}).passthrough();

export const menuEntityBodySchema = z.record(z.string(), z.unknown());

export const menuAvailabilityBodySchema = z.object({
  available: z.boolean()
});
