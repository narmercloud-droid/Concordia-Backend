import { intelligenceService } from "../services/intelligence.service.js";
import { prisma } from "../prisma/client.js";
import { NextFunction, Request, Response } from "express";

export const IntelligenceController = {
  summary: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const result = await intelligenceService.summary(branchId);
      await intelligenceService.logView(branchId, "summary");
      res.json(result);
    } catch (err: unknown) {
      next(err);
    }
  },

  report: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const result = await intelligenceService.generateReport(branchId);
      await intelligenceService.logView(branchId, "report");
      res.json(result);
    } catch (err: unknown) {
      next(err);
    }
  },

  logs: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const logs = await prisma.dashboardViewLog.findMany({
        where: { branchId },
        orderBy: { createdAt: "desc" },
      });
      res.json(logs);
    } catch (err: unknown) {
      next(err);
    }
  },
};



