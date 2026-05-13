import type { AuthenticatedRequest } from "../globalTypes.js";
import { menuOptimizationService } from "../services/menuOptimization.service.js";
import { NextFunction, Response } from "express";

export const MenuOptimizationController = {
  optimize: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const result = await menuOptimizationService.optimize(branchId);
      res.json(result);
    } catch (err: unknown) {
      next(err);
    }
  },
};


