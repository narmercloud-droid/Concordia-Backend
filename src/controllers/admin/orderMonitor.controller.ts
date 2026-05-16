import { Request, Response, NextFunction } from "express";
import { OrderMonitorService } from "../../services/admin/orderMonitor.service.js";
import { success, fail } from "../controllerHelper.js";

export class OrderMonitorController {
  static async getLiveOrders(_req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await OrderMonitorService.getLiveOrders();

      return success(res, orders, "Live orders fetched");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  }
}
