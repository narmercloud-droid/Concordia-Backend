import { OrderMonitorService } from "../../services/admin/orderMonitor.service.js";
export class OrderMonitorController {
    // -----------------------------------------------------
    // GET LIVE ORDERS
    // -----------------------------------------------------
    static async getLiveOrders(_req, res, next) {
        try {
            const orders = await OrderMonitorService.getLiveOrders();
            res.json(orders);
            return;
        }
        catch (err) {
            next(err);
        }
    }
}
