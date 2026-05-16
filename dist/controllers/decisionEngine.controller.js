import { decisionEngineService } from "../services/decisionEngine.service.js";
import { prisma } from "../prisma/client.js";
import { success, fail } from "./controllerHelper.js";
export const DecisionEngineController = {
    run: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const result = await decisionEngineService.run(branchId);
            return success(res, result, "Decision engine run");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    logs: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const logs = await prisma.decisionLog.findMany({
                where: { branchId },
                orderBy: { createdAt: "desc" }
            });
            return success(res, logs, "Decision logs");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
};
