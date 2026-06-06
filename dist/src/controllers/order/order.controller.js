import { OrderService } from "../../services/order/order.service.js";
import { routeOrderToKitchens } from "../../services/printer/kitchenRouting.service.js";
import { success, fail } from "../controllerHelper.js";
import { ordersCreatedTotal } from "../../metrics/metrics.js";
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
            await routeOrderToKitchens(order.id);
            // increment orders counter
            try {
                ordersCreatedTotal.inc(1);
            }
            catch (e) { /* ignore metric errors */ }
            return success(res, order, "Created", 201);
        }
        catch (err) {
            next(err);
        }
    }
    // -----------------------------------------------------
    // UPDATE ORDER STATUS (pending â†’ accepted â†’ preparing â†’ ready â†’ delivered)
    // -----------------------------------------------------
    static async updateStatus(req, res, next) {
        try {
            const { orderId } = req.params;
            const { status, estimated_time } = req.body;
            const order = await OrderService.updateStatus(orderId, status, estimated_time);
            return success(res, order);
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
            return success(res, order);
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
            return success(res, orders);
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
                return fail(res, "Order not found", 404);
            }
            return success(res, order);
        }
        catch (err) {
            next(err);
        }
    }
}
