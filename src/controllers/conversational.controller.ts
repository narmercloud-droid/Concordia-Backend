import { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../globalTypes.js";
import { conversationalService } from "../services/conversational.service.js";
import { success, fail } from "./controllerHelper.js";
import { conversationalTalkBodySchema } from "../validation/conversational.schema.js";

const validationMessage = (issues: { message: string }[]) =>
  issues.map((i) => i.message).join(", ") || "Invalid input";

export const ConversationalController = {
  talk: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user.branchId;
      const parsed = conversationalTalkBodySchema.safeParse(req.body);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const { message } = parsed.data;
      const response = await conversationalService.respond(branchId, message);
      return success(res, { message, response }, "Response generated");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  history: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const logs = await conversationalService.history(branchId);
      return success(res, logs, "Conversation history");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  }
};
