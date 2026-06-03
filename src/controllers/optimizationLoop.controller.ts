import type { AuthenticatedRequest } from "../globalTypes.ts";
import { optimizationLoopService } from "../services/optimizationLoop.service.ts";
import { prisma } from "../prisma/client.ts";
import { wrap } from "../contracts/api.js";

export const OptimizationLoopController = {
  run: wrap(async (req: AuthenticatedRequest) => {
    const branchId = req.user!.branchId;
    const result = await optimizationLoopService.run(branchId);
    return result;
  }),

  logs: wrap(async (req: AuthenticatedRequest) => {
    const branchId = req.user!.branchId;
    const logs = await prisma.optimizationLog.findMany({
      where: { branchId },
      orderBy: { createdAt: "desc" },
    });
    return logs;
  }),
};








