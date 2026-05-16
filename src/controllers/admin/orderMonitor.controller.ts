import { Request, Response, NextFunction } from "express";
import { OrderMonitorService } from "../../services/admin/orderMonitor.service.js";

export class OrderMonitorController {
  // -----------------------------------------------------
  // GET LIVE ORDERS
  // -----------------------------------------------------
  static async getLiveOrders(_req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await OrderMonitorService.getLiveOrders();

      res.json(orders);
      return;
    } catch (err: unknown) {
      next(err);
    }
  }
}

