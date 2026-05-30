import { randomUUID } from "crypto";
import { prisma } from "../../prisma/client.js";
import { signToken, verifyToken } from "../../utils/jwt.js";
import { OrderLifecycleService } from "../order/orderLifecycle.service.js";

export class TerminalService {
  static async activateTerminal(branchId: string) {
    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
    });

    if (!branch) {
      throw new Error("Branch not found");
    }

    return signToken({
      branchId: branch.id,
      type: "terminal_activation",
    });
  }

  static async registerTerminal(activation_token: string, terminal_name: string) {
    const payload = verifyToken(activation_token) as any;

    if (payload.type !== "terminal_activation") {
      throw new Error("Invalid activation token");
    }

    const branch = await prisma.branch.findUnique({
      where: { id: payload.branchId },
    });

    if (!branch) {
      throw new Error("Branch not found");
    }

    const existingTerminal = await prisma.terminal.findUnique({
      where: { activation_token },
    });

    if (existingTerminal) {
      throw new Error("Terminal has already been registered");
    }

    return prisma.terminal.create({
      data: {
        id: randomUUID(),
        name: terminal_name,
        activation_token,
        branchId: branch.id,
      },
    });
  }

  static async loginTerminal(terminal_token: string) {
    const terminal = await prisma.terminal.findUnique({
      where: { activation_token: terminal_token },
    });

    if (!terminal) {
      throw new Error("Invalid terminal token");
    }

    return terminal;
  }

  static async getBranchOrders(branch_id: string) {
    return prisma.order.findMany({
      where: { branchId: branch_id },
      orderBy: { createdAt: "asc" },
      include: {
        items: {
          include: {
            item: true,
          },
        },
      },
    });
  }

  static async updateHeartbeat(terminal_id: string) {
    await prisma.terminal.update({
      where: { id: terminal_id },
      data: {
        lastSeen: new Date(),
        isOnline: true,
      },
    });
  }

  static async acknowledgeOrder(order_id: string, terminal_id: string) {
    const order = await prisma.order.findUnique({ where: { id: order_id } });

    if (!order) {
      throw new Error("Order not found");
    }

    return OrderLifecycleService.updateStatus(order_id, "acknowledged", undefined, {
      terminal_id
    });
  }

  static async assignOrder(order_id: string, terminal_id: string) {
    const terminal = await prisma.terminal.findUnique({
      where: { id: terminal_id },
    });

    if (!terminal) {
      throw new Error("Terminal not found");
    }

    const order = await prisma.order.findUnique({
      where: { id: order_id },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.terminal_id !== null) {
      throw new Error("Order is already assigned to a terminal");
    }

    const updatedOrder = await OrderLifecycleService.updateStatus(order_id, "assigned", undefined, {
      terminal_id
    });

    const { getIO } = await import("../../lib/socket.js");
    const payload = {
      order_id: updatedOrder.id,
      terminal_id: updatedOrder.terminal_id,
      status: updatedOrder.status,
      branch_id: updatedOrder.branchId,
    };
    getIO().to(`terminal_${terminal_id}`).emit("order_assigned", payload);
    getIO().to(`branch_${updatedOrder.branchId}`).emit("order_assigned", payload);

    const { OrderService } = await import("../order/order.service.js");
    OrderService.emitOrderStatus(updatedOrder);

    return updatedOrder;
  }

  static async acceptOrder(order_id: string, terminal_id: string) {
    const order = await prisma.order.findUnique({
      where: { id: order_id },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.terminal_id !== terminal_id) {
      throw new Error("Terminal not assigned to this order");
    }

    const updatedOrder = await OrderLifecycleService.updateStatus(order_id, "accepted");

    const { getIO } = await import("../../lib/socket.js");
    const payload = {
      order_id: updatedOrder.id,
      terminal_id: updatedOrder.terminal_id,
      status: updatedOrder.status,
      branch_id: updatedOrder.branchId,
    };
    getIO().to(`terminal_${terminal_id}`).emit("order_accepted", payload);
    getIO().to(`branch_${updatedOrder.branchId}`).emit("order_accepted", payload);

    const { OrderService } = await import("../order/order.service.js");
    OrderService.emitOrderStatus(updatedOrder);

    return updatedOrder;
  }

  static async rejectOrder(order_id: string, terminal_id: string) {
    const order = await prisma.order.findUnique({
      where: { id: order_id },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.terminal_id !== terminal_id) {
      throw new Error("Terminal not assigned to this order");
    }

    const updatedOrder = await OrderLifecycleService.updateStatus(order_id, "rejected", undefined, {
      terminal_id: null
    });

    const { getIO } = await import("../../lib/socket.js");
    const payload = {
      order_id: updatedOrder.id,
      terminal_id: updatedOrder.terminal_id,
      status: updatedOrder.status,
      branch_id: updatedOrder.branchId,
    };
    if (terminal_id) {
      getIO().to(`terminal_${terminal_id}`).emit("order_rejected", payload);
    }
    getIO().to(`branch_${updatedOrder.branchId}`).emit("order_rejected", payload);

    const { OrderService } = await import("../order/order.service.js");
    OrderService.emitOrderStatus(updatedOrder);

    return updatedOrder;
  }
}




