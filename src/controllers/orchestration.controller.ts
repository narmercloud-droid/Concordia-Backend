import { orchestrationService } from "../services/orchestration.service.js";
import { NextFunction, Request, Response } from "express";

export const OrchestrationController = {
  runAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const result = await orchestrationService.runAll(branchId);
      res.json(result);
    } catch (err: unknown) {
      next(err);
    }
  },

  trigger: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const { event } = req.body;
      const result = await orchestrationService.eventTrigger(branchId, event);
      res.json(result);
    } catch (err: unknown) {
      next(err);
    }
  },

  logs: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const logs = await orchestrationService.logs(branchId);
      res.json(logs);
    } catch (err: unknown) {
      next(err);
    }
  },
};


