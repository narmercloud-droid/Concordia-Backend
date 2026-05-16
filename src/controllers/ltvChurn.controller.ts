import type { AuthenticatedRequest } from "../globalTypes.js";
import { ltvChurnService } from "../services/ltvChurn.service.js";
import { NextFunction, Response } from "express";
import { success, fail } from "./controllerHelper.js";
import { customerIdParamSchema } from "../validation/common.schema.js";

const validationMessage = (issues: { message: string }[]) =>
  issues.map((i) => i.message).join(", ") || "Invalid input";

export const LtvChurnController = {
  segment: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const parsed = customerIdParamSchema.safeParse(req.params);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const result = await ltvChurnService.segment(parsed.data.customerId);
      return success(res, result, "Segment computed");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  branchSegments: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const result = await ltvChurnService.branchSegments(branchId);
      return success(res, result, "Branch segments");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  }
};
