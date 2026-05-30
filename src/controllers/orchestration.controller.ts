import type { AuthenticatedRequest } from "../globalTypes.js";
import { orchestrationService } from "../services/orchestration.service.js";
import type { NextFunction, Response  } from "express";
import { success } from "./controllerHelper.js";

export const OrchestrationController = {
  runAll: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const result = await orchestrationService.runAll(branchId);
      return success(res, result);
    } catch (err: unknown) {
      next(err);
    }
  },

  trigger: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const { event } = req.body;
      const result = await orchestrationService.eventTrigger(branchId, event);
      return success(res, result);
    } catch (err: unknown) {
      next(err);
    }
  },

  logs: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const logs = await orchestrationService.logs(branchId);
      return success(res, logs);
    } catch (err: unknown) {
      next(err);
    }
  },
};







