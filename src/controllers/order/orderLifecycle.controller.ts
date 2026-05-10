import { Request, Response } from "express";
import { prisma } from "../../prisma/client";
import { Server } from "socket.io";
import { emitOrderPreparing, emitOrderReady, emitOrderCompleted, emitOrderRejected } from "../../events/terminalEvents";

// Helper to get the Socket.IO instance
async function getIO(): Promise<Server> {
  const { getIO } = await import("../../lib/socket");
  return getIO();
}

export const OrderLifecycleController = {
  // Mark order as preparing
  async preparing(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const order = await prisma.order.findUnique({ where: { order_id: id } });
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      const updatedOrder = await prisma.order.update({
        where: { order_id: id },
        data: { status: "preparing" },
      });

      const io = await getIO();
      emitOrderPreparing(io, updatedOrder);

      res.json(updatedOrder);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  // Mark order as ready
  async ready(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const order = await prisma.order.findUnique({ where: { order_id: id } });
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      const updatedOrder = await prisma.order.update({
        where: { order_id: id },
        data: { status: "ready" },
      });

      const io = await getIO();
      emitOrderReady(io, updatedOrder);

      res.json(updatedOrder);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  // Mark order as completed
  async completed(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const order = await prisma.order.findUnique({ where: { order_id: id } });
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      const updatedOrder = await prisma.order.update({
        where: { order_id: id },
        data: { status: "completed" },
      });

      const io = await getIO();
      emitOrderCompleted(io, updatedOrder);

      res.json(updatedOrder);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  // Reject order
  async reject(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const order = await prisma.order.findUnique({ where: { order_id: id } });
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      const updatedOrder = await prisma.order.update({
        where: { order_id: id },
        data: { status: "rejected" },
      });

      const io = await getIO();
      emitOrderRejected(io, updatedOrder, order.terminal_id || 0);

      res.json(updatedOrder);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },
};