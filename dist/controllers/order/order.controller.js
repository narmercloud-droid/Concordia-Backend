import { OrderService } from "../../services/order/order.service.js";
export class OrderController {
    // -----------------------------------------------------
    // CREATE ORDER
    // -----------------------------------------------------
    static async createOrder(req, res, next) {
        try {
            const { items, paymentMethod, customerId, isGuest } = req.body;
            const branchId = req.user.branchId;
            const orderData = {
                branchId,
                customerId,
                isGuest,
                paymentMethod,
                items
            };
            const order = await OrderService.createOrder(orderData);
            res.status(201).json(order);
        }
        catch (err) {
            next(err);
        }
    }
    // -----------------------------------------------------
    // UPDATE ORDER STATUS (pending → accepted → preparing → ready → delivered)
    // -----------------------------------------------------
    static async updateStatus(req, res, next) {
        try {
            const { orderId } = req.params;
            const { status, estimated_time } = req.body;
            const order = await OrderService.updateStatus(orderId, status, estimated_time);
            res.json(order);
        }
        catch (err) {
            next(err);
        }
    }
    // -----------------------------------------------------
    // COURIER PICKUP (QR CODE SCAN)
    // -----------------------------------------------------
    static async courierPickup(req, res, next) {
        try {
            const { orderId } = req.params;
            const order = await OrderService.courierPickup(orderId);
            res.json(order);
        }
        catch (err) {
            next(err);
        }
    }
    // -----------------------------------------------------
    // GET ACTIVE ORDERS (Kitchen Dashboard)
    // -----------------------------------------------------
    static async getActiveOrders(req, res, next) {
        try {
            const orders = await OrderService.getActiveOrders();
            res.json(orders);
        }
        catch (err) {
            next(err);
        }
    }
    // -----------------------------------------------------
    // GET ORDER BY ID
    // -----------------------------------------------------
    static async getOrder(req, res, next) {
        try {
            const { orderId } = req.params;
            const order = await OrderService.getOrderById(orderId);
            if (!order) {
                return res.status(404).json({ error: "Order not found" });
            }
            res.json(order);
        }
        catch (err) {
            next(err);
        }
    }
}
