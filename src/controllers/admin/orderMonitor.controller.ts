import type { Request, Response, NextFunction  } from "express";
import { OrderMonitorService } from "../../services/admin/orderMonitor.service.js";
import { success } from "../controllerHelper.js";

export class OrderMonitorController {
  // -----------------------------------------------------
  // GET LIVE ORDERS
  // -----------------------------------------------------
  static async getLiveOrders(_req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await OrderMonitorService.getLiveOrders();
      return success(res, orders);
    } catch (err: unknown) {
      next(err);
    }
  }
}






