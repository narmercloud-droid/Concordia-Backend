import { Request, Response, NextFunction } from "express";
import { courierService } from "../services/couriers.service.js";

export const CouriersController = {
  claim: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId, courierToken } = req.body;

      const order = await courierService.validateCourierToken(orderId, courierToken);
      if (!order) return res.status(403).json({ error: "Invalid or expired token" });

      const updated = await courierService.claimOrder(orderId);
      res.json(updated);
    } catch (err: unknown) {
      next(err);
    }
  },

  updateStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId, courierToken, status } = req.body;

      const order = await courierService.validateCourierToken(orderId, courierToken);
      if (!order) return res.status(403).json({ error: "Invalid or expired token" });

      const updated = await courierService.updateStatus(orderId, status);
      res.json(updated);
    } catch (err: unknown) {
      next(err);
    }
  }
};

