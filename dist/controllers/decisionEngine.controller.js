import { wrap } from "../contracts/api.js";
import { decisionEngineService } from "../services/decisionEngine.service.js";
import { prisma } from "../prisma/client.js";
export const DecisionEngineController = {
    run: wrap(async (req) => {
        const branchId = req.user.branchId;
        const result = await decisionEngineService.run(branchId);
        return result;
    }),
    logs: wrap(async (req) => {
        const branchId = req.user.branchId;
        const logs = await prisma.decisionLog.findMany({
            where: { branchId },
            orderBy: { createdAt: "desc" },
        });
        return logs;
    }),
};
