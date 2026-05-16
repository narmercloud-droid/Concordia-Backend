import { z } from "zod";
import { queryStringOptional } from "./common.schema.js";
export const managerItemAvailabilitySchema = z.object({
    itemId: z.string().min(1),
    available: z.boolean()
});
export const managerScheduleUpdateSchema = z.array(z.unknown()).or(z.record(z.string(), z.unknown()));
export const managerOrdersQuerySchema = z.object({
    status: queryStringOptional
});
