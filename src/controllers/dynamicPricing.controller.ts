import { dynamicPricingService } from "../services/dynamicPricing.service.js";
import { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "../globalTypes.js";
import { success, fail } from "./controllerHelper.js";
import { itemIdBodySchema } from "../validation/intelligence.schema.js";

const validationMessage = (issues: { message: string }[]) =>
  issues.map((i) => i.message).join(", ") || "Invalid input";

export const DynamicPricingController = {
  optimizeItem: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const parsed = itemIdBodySchema.safeParse(req.body);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const { itemId } = parsed.data;
      const result = await dynamicPricingService.applyPrice(itemId, "Manual optimize");
      return success(res, result, "Item optimized");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  optimizeBranch: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const result = await dynamicPricingService.optimizeBranch(branchId);
      return success(res, result, "Branch optimized");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  }
};
