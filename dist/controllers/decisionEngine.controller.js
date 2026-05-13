import { decisionEngineService } from "../services/decisionEngine.service.js";
import { prisma } from "../prisma/client.js";
export const DecisionEngineController = {
    run: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const result = await decisionEngineService.run(branchId);
            res.json(result);
        }
        catch (err) {
            next(err);
        }
    },
    logs: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const logs = await prisma.decisionLog.findMany({
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
