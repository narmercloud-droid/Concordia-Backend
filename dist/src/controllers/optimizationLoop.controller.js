import { optimizationLoopService } from "../services/optimizationLoop.service.js";
import { prisma } from "../prisma/client.js";
export const OptimizationLoopController = {
    run: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const result = await optimizationLoopService.run(branchId);
            res.json(result);
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
            res.json(logs);
        }
        catch (err) {
            next(err);
        }
    },
};
