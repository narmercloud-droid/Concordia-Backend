import { intelligenceService } from "../services/intelligence.service.js";
import { prisma } from "../prisma/client.js";
import { success } from "./controllerHelper.js";
export const IntelligenceController = {
    summary: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const result = await intelligenceService.summary(branchId);
            await intelligenceService.logView(branchId, "summary");
            return success(res, result);
        }
        catch (err) {
            next(err);
        }
    },
    report: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const result = await intelligenceService.generateReport(branchId);
            await intelligenceService.logView(branchId, "report");
            return success(res, result);
        }
        catch (err) {
            next(err);
        }
    },
    logs: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const logs = await prisma.dashboardViewLog.findMany({
                where: { branchId },
                orderBy: { createdAt: "desc" },
            });
            return success(res, logs);
        }
        catch (err) {
            next(err);
        }
    },
};
