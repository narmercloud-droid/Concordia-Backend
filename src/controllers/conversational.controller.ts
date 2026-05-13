import { Request, Response, NextFunction } from "express";
import { conversationalService } from "../services/conversational.service.js";

export const ConversationalController = {
  talk: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user.branchId;
      const { message } = req.body;
      const response = await conversationalService.respond(branchId, message);
      res.json({ message, response });
    } catch (err: unknown) {
      next(err);
    }
  },

  history: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user.branchId;
      const logs = await conversationalService.history(branchId);
      res.json(logs);
    } catch (err: unknown) {
      next(err);
    }
  }
};

