import { dynamicPricingService } from "../services/dynamicPricing.service.js";
import { NextFunction, Request, Response } from "express";

export const DynamicPricingController = {
  optimizeItem: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { itemId } = req.body;
      const result = await dynamicPricingService.applyPrice(itemId, "Manual optimize");
      res.json(result);
    } catch (err: unknown) {
      next(err);
    }
  },

  optimizeBranch: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const result = await dynamicPricingService.optimizeBranch(branchId);
      res.json(result);
    } catch (err: unknown) {
      next(err);
    }
  },
};


