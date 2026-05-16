import type { AuthenticatedRequest } from "../globalTypes.js";
import { optimizationLoopService } from "../services/optimizationLoop.service.js";
import { prisma } from "../prisma/client.js";
import { NextFunction, Response } from "express";
import { success, fail } from "./controllerHelper.js";

export const OptimizationLoopController = {
  run: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const result = await optimizationLoopService.run(branchId);
      return success(res, result, "Optimization run");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  logs: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const logs = await prisma.optimizationLog.findMany({
        where: { branchId },
        orderBy: { createdAt: "desc" }
      });
      return success(res, logs, "Optimization logs");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  }
};
