"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderMonitorController = void 0;
const orderMonitor_service_1 = require("../../services/admin/orderMonitor.service");
class OrderMonitorController {
    // -----------------------------------------------------
    // GET LIVE ORDERS
    // -----------------------------------------------------
    static async getLiveOrders(_req, res) {
        try {
            const orders = await orderMonitor_service_1.OrderMonitorService.getLiveOrders();
            res.json(orders);
            return;
        }
        catch (err) {
            res.status(500).json({ error: err.message });
            return;
        }
    }
}
exports.OrderMonitorController = OrderMonitorController;
