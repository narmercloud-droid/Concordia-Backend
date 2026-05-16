import { OrderMonitorService } from "../../services/admin/orderMonitor.service.js";
import { success, fail } from "../controllerHelper.js";
export class OrderMonitorController {
    static async getLiveOrders(_req, res, next) {
        try {
            const orders = await OrderMonitorService.getLiveOrders();
            return success(res, orders, "Live orders fetched");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
}
