import type { Request } from "express";
import { ltmlService } from "../services/ltml.service.ts";
import { wrap } from "../contracts/api.js";

export const LTMLController = {
  save: wrap(async (req: Request) => {
    const branchId = (req as any).user.branchId;
    const { module, key, value } = req.body;
    const result = await ltmlService.save(branchId, module, key, value);
    return result;
  }),

  trends: wrap(async (req: Request) => {
    const branchId = (req as any).user.branchId;
    const result = await ltmlService.generateTrends(branchId);
    return result;
  }),

  summary: wrap(async (req: Request) => {
    const branchId = (req as any).user.branchId;
    const result = await ltmlService.summary(branchId);
    return result;
  })
};






