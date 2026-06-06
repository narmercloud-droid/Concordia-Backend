import { nlaeService } from "../services/nlae.service.js";
import { prisma } from "../prisma/client.js";
import { wrap } from "../contracts/api.js";
export const NLAEController = {
    ask: wrap(async (req) => {
        const branchId = req.user.branchId;
        const { question } = req.body;
        const answer = await nlaeService.ask(branchId, question);
        return { question, answer };
    }),
    history: wrap(async (req) => {
        const branchId = req.user.branchId;
        const logs = await prisma.analyticsQueryLog.findMany({
            where: { branchId },
            orderBy: { createdAt: "desc" }
        });
        return logs;
    })
};
