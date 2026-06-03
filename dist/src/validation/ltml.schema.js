import { z } from "zod";
export const ltmlBodySchema = z.record(z.string(), z.unknown());
export const ltmlSaveBodySchema = z.object({
    module: z.string().min(1),
    key: z.string().min(1),
    value: z.unknown()
});
