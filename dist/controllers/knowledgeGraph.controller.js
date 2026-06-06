import { knowledgeGraphService } from "../services/knowledgeGraph.service.js";
import { prisma } from "../prisma/client.js";
import { wrap } from "../contracts/api.js";
export const KnowledgeGraphController = {
    analyze: wrap(async (req) => {
        const branchId = req.user.branchId;
        const result = await knowledgeGraphService.analyze(branchId);
        return result;
    }),
    insights: wrap(async (req) => {
        const branchId = req.user.branchId;
        const logs = await prisma.insightLog.findMany({
            where: { branchId },
            orderBy: { createdAt: "desc" },
        });
        return logs;
    }),
};
