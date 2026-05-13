import { menuOptimizationService } from "../services/menuOptimization.service.js";
import { NextFunction, Request, Response } from "express";

export const MenuOptimizationController = {
  optimize: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const result = await menuOptimizationService.optimize(branchId);
      res.json(result);
    } catch (err: unknown) {
      next(err);
    }
  },
};


