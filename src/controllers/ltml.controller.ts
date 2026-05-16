import { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../globalTypes.js";
import { ltmlService } from "../services/ltml.service.js";
import { success, fail } from "./controllerHelper.js";
import { ltmlSaveBodySchema } from "../validation/ltml.schema.js";

const validationMessage = (issues: { message: string }[]) =>
  issues.map((i) => i.message).join(", ") || "Invalid input";

export const LTMLController = {
  save: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const parsed = ltmlSaveBodySchema.safeParse(req.body);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const { module, key, value } = parsed.data;
      const result = await ltmlService.save(branchId, module, key, value);
      return success(res, result, "LTML saved");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  trends: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const result = await ltmlService.generateTrends(branchId);
      return success(res, result, "Trends generated");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  summary: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const result = await ltmlService.summary(branchId);
      return success(res, result, "Summary fetched");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  }
};
