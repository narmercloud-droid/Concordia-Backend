import { optimizationLoopService } from "../services/optimizationLoop.service.js";
import { prisma } from "../prisma/client.js";
import { wrap } from "../contracts/api.js";
export const OptimizationLoopController = {
    run: wrap(async (req) => {
        const branchId = req.user.branchId;
        const result = await optimizationLoopService.run(branchId);
        return result;
    }),
    logs: wrap(async (req) => {
        const branchId = req.user.branchId;
        const logs = await prisma.optimizationLog.findMany({
            where: { branchId },
            orderBy: { createdAt: "desc" },
        });
        return logs;
    }),
};
