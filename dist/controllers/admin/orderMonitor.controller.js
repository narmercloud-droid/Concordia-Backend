var _a;
import { OrderMonitorService } from "../../services/admin/orderMonitor.service.js";
import { wrap } from "../../contracts/api.js";
export class OrderMonitorController {
}
_a = OrderMonitorController;
// -----------------------------------------------------
// GET LIVE ORDERS
// -----------------------------------------------------
OrderMonitorController.getLiveOrders = wrap(async (_req) => {
    const orders = await OrderMonitorService.getLiveOrders();
    return orders;
});
