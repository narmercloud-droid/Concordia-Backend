var _a;
import { OrderService } from "../../services/order/order.service.js";
import { routeOrderToKitchens } from "../../services/printer/kitchenRouting.service.js";
import { wrap, fail } from "../../contracts/api.js";
import { ordersCreatedTotal } from "../../metrics/metrics.js";
export class OrderController {
}
_a = OrderController;
// -----------------------------------------------------
// CREATE ORDER
// -----------------------------------------------------
OrderController.createOrder = wrap(async (req) => {
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
    catch (_e) {
        void _e; /* ignore metric errors */
    }
    return order;
});
// -----------------------------------------------------
// UPDATE ORDER STATUS (pending → accepted → preparing → ready → delivered)
// -----------------------------------------------------
OrderController.updateStatus = wrap(async (req) => {
    const { orderId } = req.params;
    const { status, estimated_time } = req.body;
    const order = await OrderService.updateStatus(orderId, status, estimated_time);
    return order;
});
// -----------------------------------------------------
// COURIER PICKUP (QR CODE SCAN)
// -----------------------------------------------------
OrderController.courierPickup = wrap(async (req) => {
    const { orderId } = req.params;
    const order = await OrderService.courierPickup(orderId);
    return order;
});
// -----------------------------------------------------
// GET ACTIVE ORDERS (Kitchen Dashboard)
// -----------------------------------------------------
OrderController.getActiveOrders = wrap(async () => {
    const orders = await OrderService.getActiveOrders();
    return orders;
});
// -----------------------------------------------------
// GET ORDER BY ID
// -----------------------------------------------------
OrderController.getOrder = wrap(async (req) => {
    const { orderId } = req.params;
    const order = await OrderService.getOrderById(orderId);
    if (!order)
        throw fail('NOT_FOUND', 'Order not found');
    return order;
});
