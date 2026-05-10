import { prisma } from "../../prisma/client";
import { OrderStatus } from "@prisma/client";
import { emitOrderUpdated, emitOrderReady, emitOrderCompleted } from "../../events/kdsEvents";

export class KDSService {
  // -----------------------------------------------------
  // LOGIN KDS
  // -----------------------------------------------------
  static async loginKDS(kds_token: string) {
    const kds = await prisma.kitchenDisplay.findUnique({
      where: { kds_token },
    });

    if (!kds) {
      throw new Error("Invalid KDS token");
    }

    // Update online status and last seen
    await prisma.kitchenDisplay.update({
      where: { id: kds.id },
      data: { is_online: true },
    });

    return kds;
  }

  // -----------------------------------------------------
  // GET BRANCH ORDERS FOR KDS
  // -----------------------------------------------------
  static async getBranchOrders(branch_id: number) {
    const orders = await prisma.order.findMany({
      where: { branch_id },
      orderBy: [
        { status: "asc" }, // pending first, then accepted, preparing, ready
        { createdAt: "asc" },
      ],
      include: {
        items: {
          include: {
            item: true,
            variant: true,
            toppings: {
              include: {
                topping: true,
              },
            },
            extras: {
              include: {
                extra: true,
              },
            },
          },
        },
        terminal: true,
      },
    });

    return orders.map((order) => ({
      id: order.id,
      order_id: order.order_id,
      items: order.items,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      terminal_id: order.terminal_id,
    }));
  }

  // -----------------------------------------------------
  // UPDATE ORDER STATUS
  // -----------------------------------------------------
  static async updateOrderStatus(order_id: string, status: OrderStatus, kds_id: number, branch_id: number) {
    // Verify order belongs to branch
    const order = await prisma.order.findUnique({
      where: { order_id },
      include: { branch: true },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.branch_id !== branch_id) {
      throw new Error("Order does not belong to this branch");
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { order_id },
      data: { status },
      include: {
        items: {
          include: {
            item: true,
            variant: true,
            toppings: {
              include: {
                topping: true,
              },
            },
            extras: {
              include: {
                extra: true,
              },
            },
          },
        },
        terminal: true,
      },
    });

    // Emit socket events based on status
    const orderPayload = {
      id: updatedOrder.id,
      order_id: updatedOrder.order_id,
      items: updatedOrder.items,
      status: updatedOrder.status,
      createdAt: updatedOrder.createdAt,
      updatedAt: updatedOrder.updatedAt,
      terminal_id: updatedOrder.terminal_id,
    };

    switch (status) {
      case "preparing":
      case "accepted":
        emitOrderUpdated(orderPayload);
        break;
      case "ready":
        emitOrderReady(orderPayload);
        break;
      case "completed":
        emitOrderCompleted(orderPayload);
        break;
    }

    return orderPayload;
  }
}