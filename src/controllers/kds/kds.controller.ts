import type { AuthenticatedRequest } from "../../globalTypes.ts";
import type { Request } from "express";
import { KdsService } from "../../services/kds/kds.service.ts";
import { wrap, fail } from "../../contracts/api.js";

export const KdsController = {
  getOrders: wrap(async (req: AuthenticatedRequest) => {
    const kds = req.user;
    const orders = await KdsService.getActiveOrders(kds.branchId);
    return { orders };
  }),

  updateStatus: wrap(async (req: AuthenticatedRequest & Request) => {
    const { orderId, status } = req.body;
    const kds = req.user;
    const valid = ["preparing", "ready", "completed"];
    if (!valid.includes(status)) {
      throw fail('INVALID_INPUT', 'Invalid status');
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
    return { success: true, order };
  })
};






