import type { AuthenticatedRequest } from "../globalTypes.js";
import { ltvChurnService } from "../services/ltvChurn.service.js";
import type { NextFunction, Response  } from "express";
import { success } from "./controllerHelper.js";

export const LtvChurnController = {
  segment: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const customerId = req.params.customerId as string;
      const result = await ltvChurnService.segment(customerId);
      return success(res, result);
    } catch (err: unknown) {
      next(err);
    }
  },

  branchSegments: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const result = await ltvChurnService.branchSegments(branchId);
      return success(res, result);
    } catch (err: unknown) {
      next(err);
    }
  },
};







