import type { Request  } from "express";
import { ordersService } from "../services/orders.service.ts";
import { wrap, fail } from "../contracts/api.js";

export const OrdersController = {
  create: wrap(async (req: Request) => {
    const order = await ordersService.createOrder(req.body);
    return order;
  }),

  listBranchOrders: wrap(async (req: Request) => {
    const orders = await ordersService.listBranchOrders(req.params.branchId);
    return orders;
  }),

  updateStatus: wrap(async (req: Request) => {
    const order = await ordersService.updateStatus(req.params.id, req.body.status);
    return order;
  }),

  courierClaim: wrap(async (req: Request) => {
    const { orderId, courierToken } = req.body;
    const order = await ordersService.validateCourierToken(orderId, courierToken);
    if (!order) throw fail('FORBIDDEN', 'Invalid or expired token');

    const updated = await ordersService.updateStatus(orderId, 'picked_up');
    return updated;
  }),

  courierPickedUp: wrap(async (req: Request) => {
    const { orderId, courierToken } = req.body;
    const order = await ordersService.validateCourierToken(orderId, courierToken);
    if (!order) throw fail('FORBIDDEN', 'Invalid or expired token');

    const updated = await ordersService.courierPickedUp(orderId);
    return updated;
  }),

  courierDelivered: wrap(async (req: Request) => {
    const { orderId, courierToken } = req.body;
    const order = await ordersService.validateCourierToken(orderId, courierToken);
    if (!order) throw fail('FORBIDDEN', 'Invalid or expired token');

    const updated = await ordersService.courierDelivered(orderId);
    return updated;
  }),
};






