import type { AuthenticatedRequest } from "../globalTypes.js";
import { staffingPrepService } from "../services/staffingPrep.service.js";
import type { NextFunction, Response  } from "express";

export const StaffingPrepController = {
  fullPlan: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const result = await staffingPrepService.fullPlan(branchId);
      res.tson(result);
    } catch (err: unknown) {
      next(err);
    }
  },
};







