import { knowledgeGraphService } from "../services/knowledgeGraph.service.js";
import { prisma } from "../prisma/client.js";
import { success, fail } from "./controllerHelper.js";
export const KnowledgeGraphController = {
    analyze: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const result = await knowledgeGraphService.analyze(branchId);
            return success(res, result, "Knowledge graph analyzed");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    insights: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const logs = await prisma.insightLog.findMany({
                where: { branchId },
                orderBy: { createdAt: "desc" }
            });
            return success(res, logs, "Insights fetched");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
};
