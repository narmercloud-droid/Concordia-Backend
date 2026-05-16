import type { AuthenticatedRequest } from "../globalTypes.js";
import { orchestrationService } from "../services/orchestration.service.js";
import { NextFunction, Response } from "express";
import { success, fail } from "./controllerHelper.js";
import { orchestrationEventBodySchema } from "../validation/intelligence.schema.js";

const validationMessage = (issues: { message: string }[]) =>
  issues.map((i) => i.message).join(", ") || "Invalid input";

export const OrchestrationController = {
  runAll: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const result = await orchestrationService.runAll(branchId);
      return success(res, result, "Orchestration complete");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  trigger: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const parsed = orchestrationEventBodySchema.safeParse(req.body);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const { event } = parsed.data;
      const result = await orchestrationService.eventTrigger(branchId, event);
      return success(res, result, "Event triggered");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  logs: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const logs = await orchestrationService.logs(branchId);
      return success(res, logs, "Orchestration logs");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  }
};
