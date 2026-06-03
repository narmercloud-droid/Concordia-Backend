import { optimizationLoopService } from "../services/optimizationLoop.service.js";
import { prisma } from "../prisma/client.js";
import { success } from "./controllerHelper.js";
export const OptimizationLoopController = {
    run: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const result = await optimizationLoopService.run(branchId);
            return success(res, result);
        }
        catch (err) {
            next(err);
        }
    },
    logs: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const logs = await prisma.optimizationLog.findMany({
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
