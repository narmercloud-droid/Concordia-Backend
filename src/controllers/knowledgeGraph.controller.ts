import type { AuthenticatedRequest } from "../globalTypes.ts";
import { knowledgeGraphService } from "../services/knowledgeGraph.service.ts";
import { prisma } from "../prisma/client.ts";
import { wrap } from "../contracts/api.js";

export const KnowledgeGraphController = {
  analyze: wrap(async (req: AuthenticatedRequest) => {
    const branchId = req.user!.branchId;
    const result = await knowledgeGraphService.analyze(branchId);
    return result;
  }),

  insights: wrap(async (req: AuthenticatedRequest) => {
    const branchId = req.user!.branchId;
    const logs = await prisma.insightLog.findMany({
      where: { branchId },
      orderBy: { createdAt: "desc" },
    });
    return logs;
  }),
};








