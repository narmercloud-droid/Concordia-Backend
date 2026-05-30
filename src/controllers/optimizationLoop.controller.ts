import type { AuthenticatedRequest } from "../globalTypes.js";
import { optimizationLoopService } from "../services/optimizationLoop.service.js";
import { prisma } from "../prisma/client.js";
import type { NextFunction, Response  } from "express";
import { success } from "./controllerHelper.js";

export const OptimizationLoopController = {
  run: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const result = await optimizationLoopService.run(branchId);
      return success(res, result);
    } catch (err: unknown) {
      next(err);
    }
  },

  logs: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const logs = await prisma.optimizationLog.findMany({
        where: { branchId },
        orderBy: { createdAt: "desc" },
      });
      return success(res, logs);
    } catch (err: unknown) {
      next(err);
    }
  },
};








