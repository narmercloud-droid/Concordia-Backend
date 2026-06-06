import { intelligenceService } from "../services/intelligence.service.js";
import { prisma } from "../prisma/client.js";
import { wrap } from "../contracts/api.js";
export const IntelligenceController = {
    summary: wrap(async (req) => {
        const branchId = req.user.branchId;
        const result = await intelligenceService.summary(branchId);
        await intelligenceService.logView(branchId, "summary");
        return result;
    }),
    report: wrap(async (req) => {
        const branchId = req.user.branchId;
        const result = await intelligenceService.generateReport(branchId);
        await intelligenceService.logView(branchId, "report");
        return result;
    }),
    logs: wrap(async (req) => {
        const branchId = req.user.branchId;
        const logs = await prisma.dashboardViewLog.findMany({
            where: { branchId },
            orderBy: { createdAt: "desc" },
        });
        return logs;
    }),
};
