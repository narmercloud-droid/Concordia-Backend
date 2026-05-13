import { optimizationLoopService } from "../services/optimizationLoop.service.js";
import { prisma } from "../prisma/client.js";
import { NextFunction, Request, Response } from "express";

export const OptimizationLoopController = {
  run: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const result = await optimizationLoopService.run(branchId);
      res.json(result);
    } catch (err: unknown) {
      next(err);
    }
  },

  logs: async (req: Request, res: Response, next: NextFunction) => {
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



