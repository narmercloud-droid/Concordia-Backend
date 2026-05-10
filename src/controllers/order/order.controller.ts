import { Request, Response } from "express";
import { OrderService } from "../../services/order/order.service";

export class OrderController {
  // -----------------------------------------------------
  // CREATE ORDER
  // -----------------------------------------------------
  static async createOrder(req: Request, res: Response) {
    const { cartId, branch_id } = req.body;

    try {
      const order = await OrderService.createOrder(cartId, branch_id);
      res.status(201).json(order);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  // -----------------------------------------------------
  // UPDATE ORDER STATUS (pending → accepted → preparing → ready → delivered)
  // -----------------------------------------------------
  static async updateStatus(req: Request, res: Response) {
    const { orderId } = req.params;
    const { status, estimated_time } = req.body;

    try {
      const order = await OrderService.updateStatus(orderId, status, estimated_time);
      res.json(order);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  // -----------------------------------------------------
  // COURIER PICKUP (QR CODE SCAN)
  // -----------------------------------------------------
  static async courierPickup(req: Request, res: Response) {
    try {
      const { orderId } = req.params;

      const order = await OrderService.courierPickup(orderId);

      res.json(order);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  // -----------------------------------------------------
  // GET ACTIVE ORDERS (Kitchen Dashboard)
  // -----------------------------------------------------
  static async getActiveOrders(req: Request, res: Response) {
    const orders = await OrderService.getActiveOrders();
    res.json(orders);
  }

  // -----------------------------------------------------
  // GET ORDER BY ID
  // -----------------------------------------------------
  static async getOrder(req: Request, res: Response) {
    const { orderId } = req.params;

    const order = await OrderService.getOrderById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  }
}
