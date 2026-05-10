import { Request, Response } from "express";
import { OrderMonitorService } from "../../services/admin/orderMonitor.service";

export class OrderMonitorController {
  // -----------------------------------------------------
  // GET LIVE ORDERS
  // -----------------------------------------------------
  static async getLiveOrders(_req: Request, res: Response) {
    try {
      const orders = await OrderMonitorService.getLiveOrders();

      res.json(orders);
      return;
    } catch (err: any) {
      res.status(500).json({ error: err.message });
      return;
    }
  }
}
