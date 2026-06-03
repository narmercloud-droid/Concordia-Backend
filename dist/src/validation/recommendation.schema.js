import { z } from "zod";
import { queryStringOptional } from "./common.schema.js";
export const recommendationBodySchema = z.record(z.string(), z.unknown());
export const recommendationQuerySchema = z.object({
    branchId: queryStringOptional
});
