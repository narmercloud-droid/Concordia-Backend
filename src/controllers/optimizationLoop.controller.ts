import type { AuthenticatedRequest } from "../globalTypes.js";
import { optimizationLoopService } from "../services/optimizationLoop.service.js";
import { prisma } from "../prisma/client.js";
import { NextFunction, Response } from "express";

export const OptimizationLoopController = {
  run: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const result = await optimizationLoopService.run(branchId);
      res.json(result);
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
      res.json(logs);
    } catch (err: unknown) {
      next(err);
    }
  },
};



