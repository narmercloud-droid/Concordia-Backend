import { Request, Response, NextFunction } from "express";
import { OrderService } from "../../services/order/order.service.js";

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    role: string;
    branchId: string;
  };
}

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
      res.status(201).json(order);
    } catch (err: unknown) {
      next(err);
    }
  }

  // -----------------------------------------------------
  // UPDATE ORDER STATUS (pending → accepted → preparing → ready → delivered)
  // -----------------------------------------------------
  static async updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.params;
      const { status, estimated_time } = req.body;

      const order = await OrderService.updateStatus(orderId, status, estimated_time);
      res.json(order);
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

      res.json(order);
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
      res.json(orders);
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
        return res.status(404).json({ error: "Order not found" });
      }

      res.json(order);
    } catch (err: unknown) {
      next(err);
    }
  }
}

