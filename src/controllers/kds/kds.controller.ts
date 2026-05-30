import type { AuthenticatedRequest } from "../../globalTypes.js";
import type { NextFunction, Response  } from "express";
import { KdsService } from "../../services/kds/kds.service.js";
import { success, fail } from "../controllerHelper.js";


export const KdsController = {
  getOrders: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const kds = req.user;
      const orders = await KdsService.getActiveOrders(kds.branchId);
      return success(res, { orders });
    } catch (err: unknown) {
      next(err);
    }
  },
  updateStatus: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { orderId, status } = req.body;
      const kds = req.user;
      const valid = ["preparing", "ready", "completed"];
      if (!valid.includes(status)) {
        return fail(res, "Invalid status", 400);
      }
      const order = await KdsService.updateStatus(orderId, status);
      req.app
        .get("io")
        .to(`branch_${kds.branchId}`)
        .emit("order_status_updated", order);
      req.app
        .get("io")
        .to(`customer_${order.id}`)
        .emit("order_update", order);
      return success(res, { success: true, order });
    } catch (err: unknown) {
      next(err);
    }
  }
};






