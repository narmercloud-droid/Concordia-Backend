import { z } from "zod";
import { queryStringOptional } from "./common.schema.ts";

export const analyticsBodySchema = z.record(z.string(), z.unknown());

export const analyticsBranchQuerySchema = z.object({
  branchId: queryStringOptional
});




