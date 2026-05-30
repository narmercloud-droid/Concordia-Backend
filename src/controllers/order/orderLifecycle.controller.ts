import type { Request, Response, NextFunction  } from "express";
import { prisma } from "../../prisma/client.js";
import { randomUUID } from "crypto";
import { Server } from "socket.io";
import {
  emitOrderPreparing,
  emitOrderReady,
  emitOrderCompleted,
  emitOrderRejected
} from "../../events/terminalEvents.js";
import { PaymentOrchestrator } from "../../services/paymentOrchestrator.service.js";
import { WalletService } from "../../services/wallet.service.js";
import { OrderLifecycleService } from "../../services/order/orderLifecycle.service.js";
import { success, fail } from "../controllerHelper.js";

function buildOrderItems(items: any[]) {
  return items.map(i => ({
    id: randomUUID(),
    quantity: i.qty ?? i.quantity ?? 1,
    notes: i.notes ?? null,
    price: i.price,
    variantId: i.variantId,
    addOnIds: i.addOnIds ?? [],
    item: {
      connect: { id: i.itemId }
    }
  }));
}

// Helper to get the Socket.IO instance
async function getIO(): Promise<Server> {
  const { getIO } = await import("../../lib/socket.js");
  return getIO();
}

export const OrderLifecycleController = {
  // Create order with payment orchestration
  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const customerId = req.body.customerId;
      const branchId = req.body.branchId;
      const { items, addressId, paymentMethod } = req.body;

      if (!branchId) {
        throw new Error("branchId is required to create an order");
      }

      // 1. Calculate order total
      const orderTotal = items.reduce((sum: number, item: any) => sum + item.price * item.qty, 0);

      // 2. Resolve payment split
      const payment = await PaymentOrchestrator.resolvePayment(
        customerId,
        orderTotal,
        paymentMethod
      );

      // 3. Create order with payment metadata
      const order = await prisma.order.create({
        data: {
          id: randomUUID(),
          branchId,
          customerId,
          items: {
            create: buildOrderItems(items)
          },
          paymentMethod: payment.method,
          paymentStatus: payment.requiresExternalPayment
            ? "AWAITING_EXTERNAL_PAYMENT"
            : payment.method === "COD"
            ? "PENDING_PAYMENT"
            : "PAID",
          walletUsed: payment.walletUsed,
          externalAmount: payment.externalAmount
        }
      });

      // 4. If no external payment is required, deduct wallet immediately
      if (!payment.requiresExternalPayment) {
        await WalletService.deductFunds(customerId, Number(payment.walletUsed as any), order.id);

        await OrderLifecycleService.updatePaymentStatus(order.id, "PAID", { paidAt: new Date() });
      }

      // 5. Return order + payment instructions
      return success(res, {
        orderId: order.id,
        paymentMethod: payment.method,
        walletUsed: payment.walletUsed,
        externalAmount: payment.externalAmount,
        requiresExternalPayment: payment.requiresExternalPayment
      });
    } catch (err: unknown) {
      next(err);
    }
  },

  // Confirm external payment and finalize wallet deduction
  async confirmExternalPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId, transactionId } = req.body;
      const customerId = req.body.customerId;

      const order = await prisma.order.findUnique({ where: { id: orderId } });
      if (!order) throw new Error("Order not found");

      // Deduct wallet portion
      await WalletService.deductFunds(customerId, Number(order.walletUsed as any), orderId);

      // Mark order as paid
      await OrderLifecycleService.updatePaymentStatus(orderId, "PAID", {
        transactionId,
        paidAt: new Date()
      });

      return success(res, { success: true });
    } catch (err: unknown) {
      next(err);
    }
  },

  // Mark order as preparing
  async preparing(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const order = await prisma.order.findUnique({ where: { id } });
      if (!order) {
        return fail(res, "Order not found", 404);
      }

      const updatedOrder = await OrderLifecycleService.updateStatus(id, "preparing");

      const io = await getIO();
      emitOrderReady(io, updatedOrder);

      return success(res, updatedOrder);
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
        return fail(res, "Order not found", 404);
      }

      const updatedOrder = await OrderLifecycleService.updateStatus(id, "ready_for_pickup");

      const io = await getIO();
      emitOrderReady(io, updatedOrder);

      return success(res, updatedOrder);
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
        return fail(res, "Order not found", 404);
      }

      const updatedOrder = await OrderLifecycleService.updateStatus(id, "completed");

      const io = await getIO();
      emitOrderCompleted(io, updatedOrder);

      return success(res, updatedOrder);
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
        return fail(res, "Order not found", 404);
      }

      const updatedOrder = await OrderLifecycleService.updateStatus(id, "rejected");

      const io = await getIO();
      emitOrderRejected(io, updatedOrder, order.terminal_id);

      return success(res, updatedOrder);
    } catch (err: unknown) {
      next(err);
    }
  },
};

export const refundOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new Error("Order not found");

    if (order.paymentStatus !== "PAID") {
      throw new Error("Only paid orders can be refunded");
    }

    // Refund wallet portion
    if (Number(order.walletUsed) > 0) {
      await WalletService.addFunds(
        order.customerId,
        Number(order.walletUsed),
        "REFUND",
        orderId
      );
    }

    // Refund external portion (PayPal/card)
    // NOTE: External refund integration can be added later.
    // For now, externalAmount is refunded to wallet.
    if (Number(order.externalAmount) > 0) {
      await WalletService.addFunds(
        order.customerId,
        Number(order.externalAmount),
        "REFUND",
        orderId
      );
    }

    await OrderLifecycleService.updatePaymentStatus(orderId, "REFUNDED");

    return success(res, { success: true });
  } catch (err) {
    return fail(res, err.message, 400);
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new Error("Order not found");

    if (order.paymentStatus === "PAID") {
      throw new Error("Paid orders must be refunded, not cancelled");
    }

    await OrderLifecycleService.updatePaymentStatus(orderId, "CANCELLED");

    return success(res, { success: true });
  } catch (err) {
    return fail(res, err.message, 400);
  }
};

export const confirmExternalPayment = OrderLifecycleController.confirmExternalPayment;





