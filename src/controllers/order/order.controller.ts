import type { AuthenticatedRequest } from "../../globalTypes.ts";
import { OrderService } from "../../services/order/order.service.ts";
import { routeOrderToKitchens } from "../../services/printer/kitchenRouting.service.ts";
import { wrap, fail } from "../../contracts/api.js";
import { ordersCreatedTotal } from "../../metrics/metrics.ts";

export class OrderController {
  // -----------------------------------------------------
  // CREATE ORDER
  // -----------------------------------------------------
  static createOrder = wrap(async (req: AuthenticatedRequest) => {
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
    try { ordersCreatedTotal.inc(1); } catch (_e) { void _e; /* ignore metric errors */ }
    return order;
  });

  // -----------------------------------------------------
  // UPDATE ORDER STATUS (pending → accepted → preparing → ready → delivered)
  // -----------------------------------------------------
  static updateStatus = wrap(async (req: AuthenticatedRequest) => {
    const { orderId } = req.params;
    const { status, estimated_time } = req.body;

    const order = await OrderService.updateStatus(orderId, status, estimated_time);
    return order;
  });

  // -----------------------------------------------------
  // COURIER PICKUP (QR CODE SCAN)
  // -----------------------------------------------------
  static courierPickup = wrap(async (req: AuthenticatedRequest) => {
    const { orderId } = req.params;

    const order = await OrderService.courierPickup(orderId);

    return order;
  });

  // -----------------------------------------------------
  // GET ACTIVE ORDERS (Kitchen Dashboard)
  // -----------------------------------------------------
  static getActiveOrders = wrap(async () => {
    const orders = await OrderService.getActiveOrders();
    return orders;
  });

  // -----------------------------------------------------
  // GET ORDER BY ID
  // -----------------------------------------------------
  static getOrder = wrap(async (req: AuthenticatedRequest) => {
    const { orderId } = req.params;

    const order = await OrderService.getOrderById(orderId);
    if (!order) throw fail('NOT_FOUND', 'Order not found');

    return order;
  });
}






