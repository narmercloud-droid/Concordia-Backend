import { nlaeService } from "../services/nlae.service.js";
import { prisma } from "../prisma/client.js";
export const NLAEController = {
    ask: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const { question } = req.body;
            const answer = await nlaeService.ask(branchId, question);
            res.json({ question, answer });
        }
        catch (err) {
            next(err);
        }
    },
    history: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const logs = await prisma.analyticsQueryLog.findMany({
                where: { branchId },
                orderBy: { createdAt: "desc" }
            });
            res.json(logs);
        }
        catch (err) {
            next(err);
        }
    }
};
