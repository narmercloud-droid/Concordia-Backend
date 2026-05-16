import { Request, Response, NextFunction } from "express";
import { ltmlService } from "../services/ltml.service.js";

export const LTMLController = {
  save: async (req: Request, res: Response, next: NextFunction) => {
    const branchId = req.user.branchId;
    const { module, key, value } = req.body;
    const result = await ltmlService.save(branchId, module, key, value);
    res.json(result);
  },

  trends: async (req: Request, res: Response, next: NextFunction) => {
    const branchId = req.user.branchId;
    const result = await ltmlService.generateTrends(branchId);
    res.json(result);
  },

  summary: async (req: Request, res: Response, next: NextFunction) => {
    const branchId = req.user.branchId;
    const result = await ltmlService.summary(branchId);
    res.json(result);
  }
};

