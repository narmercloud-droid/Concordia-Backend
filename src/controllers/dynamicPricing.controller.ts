import { dynamicPricingService } from "../services/dynamicPricing.service.js";
import type { NextFunction, Request, Response  } from "express";
import { success } from "./controllerHelper.js";

export const DynamicPricingController = {
  optimizeItem: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { itemId } = req.body;
      const result = await dynamicPricingService.applyPrice(itemId, "Manual optimize");
      return success(res, result);
    } catch (err: unknown) {
      next(err);
    }
  },

  optimizeBranch: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const result = await dynamicPricingService.optimizeBranch(branchId);
      return success(res, result);
    } catch (err: unknown) {
      next(err);
    }
  },
};







