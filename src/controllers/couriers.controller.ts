import { Request, Response, NextFunction } from "express";
import { courierService } from "../services/couriers.service.js";
import { success, fail } from "./controllerHelper.js";
import { courierOrderActionSchema } from "../validation/orders.schema.js";
import { courierStatusUpdateSchema } from "../validation/couriers.schema.js";

const validationMessage = (issues: { message: string }[]) =>
  issues.map((i) => i.message).join(", ") || "Invalid input";

export const CouriersController = {
  claim: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = courierOrderActionSchema.safeParse(req.body);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const { orderId, courierToken } = parsed.data;

      const order = await courierService.validateCourierToken(orderId, courierToken);
      if (!order) return fail(res, "FORBIDDEN", "Invalid or expired token", 403);

      const updated = await courierService.claimOrder(orderId);
      return success(res, updated, "Order claimed");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  updateStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = courierStatusUpdateSchema.safeParse(req.body);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const { orderId, courierToken, status } = parsed.data;

      const order = await courierService.validateCourierToken(orderId, courierToken);
      if (!order) return fail(res, "FORBIDDEN", "Invalid or expired token", 403);

      const updated = await courierService.updateStatus(orderId, status);
      return success(res, updated, "Status updated");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  }
};
