import type { Request, Response, NextFunction  } from "express";
import { ordersService } from "../services/orders.service.js";
import { success, fail } from "./controllerHelper.js";

export const OrdersController = {
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await ordersService.createOrder(req.body);
      return success(res, order);
    } catch (err: unknown) {
      next(err);
    }
  },

  listBranchOrders: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await ordersService.listBranchOrders(req.params.branchId);
      return success(res, orders);
    } catch (err: unknown) {
      next(err);
    }
  },

  updateStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await ordersService.updateStatus(req.params.id, req.body.status);
      return success(res, order);
    } catch (err: unknown) {
      next(err);
    }
  },

  courierClaim: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId, courierToken } = req.body;
      const order = await ordersService.validateCourierToken(orderId, courierToken);
      if (!order) return fail(res, "Invalid or expired token", 403);

      const updated = await ordersService.updateStatus(orderId, "picked_up");
      return success(res, updated);
    } catch (err: unknown) {
      next(err);
    }
  },

  courierPickedUp: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId, courierToken } = req.body;
      const order = await ordersService.validateCourierToken(orderId, courierToken);
      if (!order) return fail(res, "Invalid or expired token", 403);

      const updated = await ordersService.courierPickedUp(orderId);
      return success(res, updated);
    } catch (err: unknown) {
      next(err);
    }
  },

  courierDelivered: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId, courierToken } = req.body;
      const order = await ordersService.validateCourierToken(orderId, courierToken);
      if (!order) return fail(res, "Invalid or expired token", 403);

      const updated = await ordersService.courierDelivered(orderId);
      return success(res, updated);
    } catch (err: unknown) {
      next(err);
    }
  }
};






