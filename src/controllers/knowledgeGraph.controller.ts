import type { AuthenticatedRequest } from "../globalTypes.js";
import { knowledgeGraphService } from "../services/knowledgeGraph.service.js";
import { prisma } from "../prisma/client.js";
import { NextFunction, Response } from "express";

export const KnowledgeGraphController = {
  analyze: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const result = await knowledgeGraphService.analyze(branchId);
      res.json(result);
    } catch (err: unknown) {
      next(err);
    }
  },

  insights: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const logs = await prisma.insightLog.findMany({
        where: { branchId },
        orderBy: { createdAt: "desc" },
      });
      res.json(logs);
    } catch (err: unknown) {
      next(err);
    }
  },
};



