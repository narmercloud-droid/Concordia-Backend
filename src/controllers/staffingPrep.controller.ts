import type { AuthenticatedRequest } from "../globalTypes.js";
import { staffingPrepService } from "../services/staffingPrep.service.js";
import { NextFunction, Response } from "express";
import { success, fail } from "./controllerHelper.js";

export const StaffingPrepController = {
  fullPlan: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const result = await staffingPrepService.fullPlan(branchId);
      return success(res, result, "Staffing plan complete");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  }
};
