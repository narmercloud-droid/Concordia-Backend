import { knowledgeGraphService } from "../services/knowledgeGraph.service.js";
import { prisma } from "../prisma/client.js";
export const KnowledgeGraphController = {
    analyze: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const result = await knowledgeGraphService.analyze(branchId);
            res.json(result);
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
            res.json(logs);
        }
        catch (err) {
            next(err);
        }
    },
};
