import type { Request } from "express";
import { conversationalService } from "../services/conversational.service.ts";
import { wrap } from "./../contracts/api.js";

export const ConversationalController = {
  talk: wrap(async (req: Request) => {
    const branchId = req.user.branchId;
    const { message } = req.body;
    const response = await conversationalService.respond(branchId, message);
    return { message, response };
  }),

  history: wrap(async (req: Request) => {
    const branchId = req.user.branchId;
    const logs = await conversationalService.history(branchId);
    return logs;
  })
};






