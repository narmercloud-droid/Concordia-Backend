import type { Request, Response, NextFunction  } from "express";
import { ltmlService } from "../services/ltml.service.js";
import { success } from "./controllerHelper.js";

export const LTMLController = {
  save: async (req: Request, res: Response, next: NextFunction) => {
    const branchId = req.user.branchId;
    const { module, key, value } = req.body;
    const result = await ltmlService.save(branchId, module, key, value);
    return success(res, result);
  },

  trends: async (req: Request, res: Response, next: NextFunction) => {
    const branchId = req.user.branchId;
    const result = await ltmlService.generateTrends(branchId);
    return success(res, result);
  },

  summary: async (req: Request, res: Response, next: NextFunction) => {
    const branchId = req.user.branchId;
    const result = await ltmlService.summary(branchId);
    return success(res, result);
  }
};






