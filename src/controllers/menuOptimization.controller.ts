import type { AuthenticatedRequest } from "../globalTypes.js";
import { menuOptimizationService } from "../services/menuOptimization.service.js";
import type { NextFunction, Response  } from "express";
import { success } from "./controllerHelper.js";

export const MenuOptimizationController = {
  optimize: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const result = await menuOptimizationService.optimize(branchId);
      return success(res, result);
    } catch (err: unknown) {
      next(err);
    }
  },
};







