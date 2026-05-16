import { optimizationLoopService } from "../services/optimizationLoop.service.js";
import { prisma } from "../prisma/client.js";
import { success, fail } from "./controllerHelper.js";
export const OptimizationLoopController = {
    run: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const result = await optimizationLoopService.run(branchId);
            return success(res, result, "Optimization run");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    logs: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const logs = await prisma.optimizationLog.findMany({
                where: { branchId },
                orderBy: { createdAt: "desc" }
            });
            return success(res, logs, "Optimization logs");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
};
