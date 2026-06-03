import type { Request } from "express";
import { nlaeService } from "../services/nlae.service.ts";
import { prisma } from "../prisma/client.ts";
import { wrap } from "../contracts/api.js";

export const NLAEController = {
  ask: wrap(async (req: Request) => {
    const branchId = req.user.branchId;
    const { question } = req.body;
    const answer = await nlaeService.ask(branchId, question);
    return { question, answer };
  }),

  history: wrap(async (req: Request) => {
    const branchId = req.user.branchId;
    const logs = await prisma.analyticsQueryLog.findMany({
      where: { branchId },
      orderBy: { createdAt: "desc" }
    });
    return logs;
  })
};







