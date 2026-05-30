import { knowledgeGraphService } from "../services/knowledgeGraph.service.js";
import { prisma } from "../prisma/client.js";
import { success } from "./controllerHelper.js";
export const KnowledgeGraphController = {
    analyze: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const result = await knowledgeGraphService.analyze(branchId);
            return success(res, result);
        }
        catch (err) {
            next(err);
        }
    },
    insights: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const logs = await prisma.insightLog.findMany({
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
