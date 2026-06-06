import { nlaeService } from "../services/nlae.service.js";
import { prisma } from "../prisma/client.js";
import { success } from "./controllerHelper.js";
export const NLAEController = {
    ask: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const { question } = req.body;
            const answer = await nlaeService.ask(branchId, question);
            return success(res, { question, answer });
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
            return success(res, logs);
        }
        catch (err) {
            next(err);
        }
    }
};
