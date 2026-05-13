import { Request, Response, NextFunction } from "express";
import { prisma } from "../../prisma/client.js";
import { Server } from "socket.io";
import {
  emitOrderPreparing,
  emitOrderReady,
  emitOrderCompleted,
  emitOrderRejected
} from "../../events/terminalEvents.js";

// Helper to get the Socket.IO instance
async function getIO(): Promise<Server> {
  const { getIO } = await import("../../lib/socket.js");
  return getIO();
}

export const OrderLifecycleController = {
  // Mark order as preparing
  async preparing(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const order = await prisma.order.findUnique({ where: { id } });
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      const updatedOrder = await prisma.order.update({
        where: { id },
        data: { status: "preparing" },
      });



      const io = await getIO();
      emitOrderReady(io, updatedOrder);

      res.json(updatedOrder);
    } catch (err: unknown) {
      next(err);
    }
  },

  // Mark order as ready
  async ready(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const order = await prisma.order.findUnique({ where: { id } });
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      const updatedOrder = await prisma.order.update({
        where: { id },
        data: { status: "ready_for_pickup" },
      });

      const io = await getIO();
      emitOrderReady(io, updatedOrder);

      res.json(updatedOrder);
    } catch (err: unknown) {
      next(err);
    }
  },

  // Mark order as completed
  async completed(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const order = await prisma.order.findUnique({ where: { id } });
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      const updatedOrder = await prisma.order.update({
        where: { id },
        data: { status: "completed" }
      });

      const io = await getIO();
      emitOrderCompleted(io, updatedOrder);

      res.json(updatedOrder);
    } catch (err: unknown) {
      next(err);
    }
  },

  // Reject order
  async reject(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const order = await prisma.order.findUnique({ where: { id } });
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      const updatedOrder = await prisma.order.update({
        where: { id },
        data: { status: "rejected" }
      });

      const io = await getIO();
      emitOrderRejected(io, updatedOrder, order.terminal_id);

      res.json(updatedOrder);
    } catch (err: unknown) {
      next(err);
    }
  },
};

