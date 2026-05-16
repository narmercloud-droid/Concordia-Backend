import { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../globalTypes.js";
import { nlaeService } from "../services/nlae.service.js";
import { prisma } from "../prisma/client.js";
import { success, fail } from "./controllerHelper.js";
import { nlaeAskSchema } from "../validation/nlae.schema.js";

const validationMessage = (issues: { message: string }[]) =>
  issues.map((i) => i.message).join(", ") || "Invalid input";

export const NLAEController = {
  ask: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user.branchId;
      const parsed = nlaeAskSchema.safeParse(req.body);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const { question } = parsed.data;
      const answer = await nlaeService.ask(branchId, question);
      return success(res, { question, answer }, "Answered");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  history: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const logs = await prisma.analyticsQueryLog.findMany({
        where: { branchId },
        orderBy: { createdAt: "desc" }
      });
      return success(res, logs, "NLAE history");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  }
};
