import { z } from "zod";
export const getTerminalActivitySchema = z.object({
    query: z.object({
        branch_id: z.string().optional(),
        status: z.enum(["active", "inactive"]).optional(),
        limit: z.string().transform(val => parseInt(val)).optional(),
    }).optional(),
});
export const getTerminalStatusSchema = z.object({
    query: z.object({
        branch_id: z.string().optional(),
    }).optional(),
});
