
import type { Request } from "express";
import { wrap } from "../contracts/api.js";
import { decisionEngineService } from "../services/decisionEngine.service.ts";
import { prisma } from "../prisma/client.ts";

export const DecisionEngineController = {
  run: wrap(async (req: Request) => {
    const branchId = req.user!.branchId;
    const result = await decisionEngineService.run(branchId);
    return result;
  }),

  logs: wrap(async (req: Request) => {
    const branchId = req.user!.branchId;
    const logs = await prisma.decisionLog.findMany({
      where: { branchId },
      orderBy: { createdAt: "desc" },
    });
    return logs;
  }),
};








