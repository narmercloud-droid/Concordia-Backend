"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const order_service_1 = require("../../services/order/order.service");
class OrderController {
    // -----------------------------------------------------
    // CREATE ORDER
    // -----------------------------------------------------
    static async createOrder(req, res) {
        const { cartId, branch_id } = req.body;
        try {
            const order = await order_service_1.OrderService.createOrder(cartId, branch_id);
            res.status(201).json(order);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    // -----------------------------------------------------
    // UPDATE ORDER STATUS (pending → accepted → preparing → ready → delivered)
    // -----------------------------------------------------
    static async updateStatus(req, res) {
        const { orderId } = req.params;
        const { status, estimated_time } = req.body;
        try {
            const order = await order_service_1.OrderService.updateStatus(orderId, status, estimated_time);
            res.json(order);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    // -----------------------------------------------------
    // COURIER PICKUP (QR CODE SCAN)
    // -----------------------------------------------------
    static async courierPickup(req, res) {
        try {
            const { orderId } = req.params;
            const order = await order_service_1.OrderService.courierPickup(orderId);
            res.json(order);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    // -----------------------------------------------------
    // GET ACTIVE ORDERS (Kitchen Dashboard)
    // -----------------------------------------------------
    static async getActiveOrders(req, res) {
        const orders = await order_service_1.OrderService.getActiveOrders();
        res.json(orders);
    }
    // -----------------------------------------------------
    // GET ORDER BY ID
    // -----------------------------------------------------
    static async getOrder(req, res) {
        const { orderId } = req.params;
        const order = await order_service_1.OrderService.getOrderById(orderId);
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        res.json(order);
    }
}
exports.OrderController = OrderController;
