import { Request, Response, NextFunction } from "express";
import { fraudService } from "../services/fraud.service.js";

export const FraudController = {
  scoreOrder: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId } = req.body;
      const result = await fraudService.scoreOrder(orderId);
      res.json(result);
    } catch (err: unknown) {
      next(err);
    }
  },

  getRisk: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId } = req.params;
      const result = await fraudService.getRisk(orderId);
      res.json(result);
    } catch (err: unknown) {
      next(err);
    }
  },

  flags: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const flags = await fraudService.getFlags();
      res.json(flags);
    } catch (err: unknown) {
      next(err);
    }
  },

  events: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId } = req.params;
      const events = await fraudService.getOrderEvents(orderId);
      res.json(events);
    } catch (err: unknown) {
      next(err);
    }
  }
};

