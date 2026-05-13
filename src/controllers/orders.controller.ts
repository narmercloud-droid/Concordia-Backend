import { Request, Response, NextFunction } from "express";
import { ordersService } from "../services/orders.service.js";

export const OrdersController = {
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await ordersService.createOrder(req.body);
      res.json(order);
    } catch (err: unknown) {
      next(err);
    }
  },

  listBranchOrders: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await ordersService.listBranchOrders(req.params.branchId);
      res.json(orders);
    } catch (err: unknown) {
      next(err);
    }
  },

  updateStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await ordersService.updateStatus(req.params.id, req.body.status);
      res.json(order);
    } catch (err: unknown) {
      next(err);
    }
  },

  courierClaim: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId, courierToken } = req.body;
      const order = await ordersService.validateCourierToken(orderId, courierToken);
      if (!order) return res.status(403).json({ error: "Invalid or expired token" });

      const updated = await ordersService.updateStatus(orderId, "picked_up");
      res.json(updated);
    } catch (err: unknown) {
      next(err);
    }
  },

  courierPickedUp: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId, courierToken } = req.body;
      const order = await ordersService.validateCourierToken(orderId, courierToken);
      if (!order) return res.status(403).json({ error: "Invalid or expired token" });

      const updated = await ordersService.courierPickedUp(orderId);
      res.json(updated);
    } catch (err: unknown) {
      next(err);
    }
  },

  courierDelivered: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId, courierToken } = req.body;
      const order = await ordersService.validateCourierToken(orderId, courierToken);
      if (!order) return res.status(403).json({ error: "Invalid or expired token" });

      const updated = await ordersService.courierDelivered(orderId);
      res.json(updated);
    } catch (err: unknown) {
      next(err);
    }
  }
};

