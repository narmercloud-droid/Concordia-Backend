import { intelligenceService } from "../services/intelligence.service.js";
import { prisma } from "../prisma/client.js";
import { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "../globalTypes.js";
import { success, fail } from "./controllerHelper.js";

export const IntelligenceController = {
  summary: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const result = await intelligenceService.summary(branchId);
      await intelligenceService.logView(branchId, "summary");
      return success(res, result, "Intelligence summary");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  report: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const result = await intelligenceService.generateReport(branchId);
      await intelligenceService.logView(branchId, "report");
      return success(res, result, "Report generated");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  logs: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const logs = await prisma.dashboardViewLog.findMany({
        where: { branchId },
        orderBy: { createdAt: "desc" }
      });
      return success(res, logs, "View logs");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  }
};
