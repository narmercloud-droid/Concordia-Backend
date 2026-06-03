import type { Request } from "express";
import { OrderMonitorService } from "../../services/admin/orderMonitor.service.ts";
import { wrap } from "../../contracts/api.js";

export class OrderMonitorController {
  // -----------------------------------------------------
  // GET LIVE ORDERS
  // -----------------------------------------------------
  static getLiveOrders = wrap(async (_req: Request) => {
    const orders = await OrderMonitorService.getLiveOrders();
    return orders;
  });
}






