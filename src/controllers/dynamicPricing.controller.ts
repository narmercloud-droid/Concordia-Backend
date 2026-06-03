import { dynamicPricingService } from "../services/dynamicPricing.service.ts";
import type { Request } from "express";
import { wrap } from "../contracts/api.js";

export const DynamicPricingController = {
  optimizeItem: wrap(async (req: Request) => {
    const { itemId } = req.body;
    const result = await dynamicPricingService.applyPrice(itemId, "Manual optimize");
    return result;
  }),

  optimizeBranch: wrap(async (req: Request) => {
    const branchId = req.user!.branchId;
    const result = await dynamicPricingService.optimizeBranch(branchId);
    return result;
  }),
};







