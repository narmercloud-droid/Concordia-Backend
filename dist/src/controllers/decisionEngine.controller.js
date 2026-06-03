import { success } from "./controllerHelper.js";
import { decisionEngineService } from "../services/decisionEngine.service.js";
import { prisma } from "../prisma/client.js";
export const DecisionEngineController = {
    run: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const result = await decisionEngineService.run(branchId);
            return success(res, result);
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
            return success(res, logs);
        }
        catch (err) {
            next(err);
        }
    },
};
