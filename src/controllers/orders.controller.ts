import type { Request } from "express";
import { ordersService } from "../services/orders.service.ts";
import { wrap, fail } from "../contracts/api.js";
import {
  assertOrderPaymentAccess,
  loadOrderForPaymentAccess
} from "../services/payments/orderPaymentAccess.ts";

export const OrdersController = {
  create: wrap(async (req: Request) => {
    try {
      const order = await ordersService.createOrder(req.body);
      return order;
    } catch (err: any) {
      throw fail("INVALID_INPUT", err?.message ?? "Could not create order");
    }
  }),

  listBranchOrders: wrap(async (req: Request) => {
    const orders = await ordersService.listBranchOrders(req.params.branchId);
    return orders;
  }),

  getStatus: wrap(async (req: Request) => {
    return await ordersService.getOrderStatus(req.params.id);
  }),

  updateStatus: wrap(async (req: Request) => {
    const order = await ordersService.updateStatus(req.params.id, req.body.status);
    return order;
  }),

  courierClaim: wrap(async (req: Request) => {
    const { orderId, courierToken } = req.body;
    const order = await ordersService.validateCourierToken(orderId, courierToken);
    if (!order) throw fail("FORBIDDEN", "Invalid or expired token");

    const updated = await ordersService.updateStatus(orderId, "picked_up");
    return updated;
  }),

  courierPickedUp: wrap(async (req: Request) => {
    const { orderId, courierToken } = req.body;
    const order = await ordersService.validateCourierToken(orderId, courierToken);
    if (!order) throw fail("FORBIDDEN", "Invalid or expired token");

    const updated = await ordersService.courierPickedUp(orderId);
    return updated;
  }),

  courierDelivered: wrap(async (req: Request) => {
    const { orderId, courierToken } = req.body;
    const order = await ordersService.validateCourierToken(orderId, courierToken);
    if (!order) throw fail("FORBIDDEN", "Invalid or expired token");

    const updated = await ordersService.courierDelivered(orderId);
    return updated;
  }),

  cancelUnpaid: wrap(async (req: Request) => {
    try {
      const order = await loadOrderForPaymentAccess(req.params.id);
      assertOrderPaymentAccess(req, order);
      const cancelReason =
        typeof req.body?.reason === "string" ? req.body.reason : undefined;
      return await ordersService.cancelUnpaidOnlineOrder(req.params.id, cancelReason);
    } catch (err: any) {
      if (err?.code) throw err;
      throw fail("INVALID_INPUT", err?.message ?? "Could not cancel order");
    }
  })
};
