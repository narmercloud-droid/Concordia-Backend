import type { AuthenticatedRequest } from "../../globalTypes.js";
import type { Response, NextFunction  } from "express";
import { OrderService } from "../../services/order/order.service.js";
import { routeOrderToKitchens } from "../../services/printer/kitchenRouting.service.js";
import { success, fail } from "../controllerHelper.js";
import { ordersCreatedTotal } from "../../metrics/metrics.js";

export class OrderController {
  // -----------------------------------------------------
  // CREATE ORDER
  // -----------------------------------------------------
  static async createOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
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
      try { ordersCreatedTotal.inc(1); } catch (e) { /* ignore metric errors */ }
      return success(res, order, "Created", 201);
    } catch (err: unknown) {
      next(err);
    }
  }

  // -----------------------------------------------------
  // UPDATE ORDER STATUS (pending â†’ accepted â†’ preparing â†’ ready â†’ delivered)
  // -----------------------------------------------------
  static async updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.params;
      const { status, estimated_time } = req.body;

      const order = await OrderService.updateStatus(orderId, status, estimated_time);
      return success(res, order);
    } catch (err: unknown) {
      next(err);
    }
  }

  // -----------------------------------------------------
  // COURIER PICKUP (QR CODE SCAN)
  // -----------------------------------------------------
  static async courierPickup(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.params;

      const order = await OrderService.courierPickup(orderId);

      return success(res, order);
    } catch (err: unknown) {
      next(err);
    }
  }

  // -----------------------------------------------------
  // GET ACTIVE ORDERS (Kitchen Dashboard)
  // -----------------------------------------------------
  static async getActiveOrders(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const orders = await OrderService.getActiveOrders();
      return success(res, orders);
    } catch (err: unknown) {
      next(err);
    }
  }

  // -----------------------------------------------------
  // GET ORDER BY ID
  // -----------------------------------------------------
  static async getOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.params;

      const order = await OrderService.getOrderById(orderId);
      if (!order) {
        return fail(res, "Order not found", 404);
      }

      return success(res, order);
    } catch (err: unknown) {
      next(err);
    }
  }
}






