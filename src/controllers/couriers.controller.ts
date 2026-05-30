import type { Request, Response, NextFunction  } from "express";
import { courierService } from "../services/couriers.service.js";
import { success, fail } from "./controllerHelper.js";

export const CouriersController = {
  claim: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId, courierToken } = req.body;

      const order = await courierService.validateCourierToken(orderId, courierToken);
      if (!order) return fail(res, "Invalid or expired token", 403);

      const updated = await courierService.claimOrder(orderId);
      return success(res, updated);
    } catch (err: unknown) {
      next(err);
    }
  },

  updateStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId, courierToken, status } = req.body;

      const order = await courierService.validateCourierToken(orderId, courierToken);
      if (!order) return fail(res, "Invalid or expired token", 403);

      const updated = await courierService.updateStatus(orderId, status);
      return success(res, updated);
    } catch (err: unknown) {
      next(err);
    }
  }
};






