import { decisionEngineService } from "../services/decisionEngine.service.js";
import { prisma } from "../prisma/client.js";
import { NextFunction, Request, Response } from "express";

export const DecisionEngineController = {
  run: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const result = await decisionEngineService.run(branchId);
      res.json(result);
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
      res.json(logs);
    } catch (err: unknown) {
      next(err);
    }
  },
};



