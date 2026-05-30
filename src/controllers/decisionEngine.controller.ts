import { decisionEngineService } from "../services/decisionEngine.service.js";
import { prisma } from "../prisma/client.js";
import type { NextFunction, Request, Response  } from "express";
import { success } from "./controllerHelper.js";

export const DecisionEngineController = {
  run: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const result = await decisionEngineService.run(branchId);
      return success(res, result);
    } catch (err: unknown) {
      next(err);
    }
  },

  logs: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const logs = await prisma.decisionLog.findMany({
        where: { branchId },
        orderBy: { createdAt: "desc" },
      });
      return success(res, logs);
    } catch (err: unknown) {
      next(err);
    }
  },
};








