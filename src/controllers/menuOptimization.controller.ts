import type { AuthenticatedRequest } from "../globalTypes.js";
import { menuOptimizationService } from "../services/menuOptimization.service.js";
import { NextFunction, Response } from "express";
import { success, fail } from "./controllerHelper.js";

export const MenuOptimizationController = {
  optimize: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const result = await menuOptimizationService.optimize(branchId);
      return success(res, result, "Menu optimized");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  }
};
