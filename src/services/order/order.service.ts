import { prisma } from "../../prisma/client.ts";
import { randomUUID } from "crypto";
import { OrderSocket } from "../../socket/order.socket.ts";
import { OrderLifecycleService } from "./orderLifecycle.service.ts";

function buildOrderItems(items: any[]) {
  return items.map(item => ({
    id: randomUUID(),
    quantity: item.quantity ?? 1,
    notes: item.notes ?? null,
    price: item.price,
    variantId: item.variantId,
    addOnIds: item.addOnIds ?? [],
    item: {
      connect: { id: item.itemId }
    }
  }));
}

interface CreateOrderData {
  branchId: string;
  customerId?: string;
  isGuest?: boolean;
  paymentMethod: string;
  items: Array<{
    itemId: string;
    variantId: string;
    addOnIds: string[];
    quantity: number;
    notes?: string;
    price: number;
  }>;
}

export class OrderService {
  static async createOrder(orderData: CreateOrderData): Promise<any> {
    const { branchId, customerId, isGuest = false, paymentMethod, items } = orderData;

    if (!items || items.length === 0) {
      throw new Error("Order must have at least one item");
    }



    const order = await prisma.order.create({
      data: {
        id: randomUUID(),
        branchId,
        customerId,
        isGuest,
        paymentMethod,
        paymentStatus: "pending",
        status: "pending",
        items: {
          create: buildOrderItems(items)
        }
      },
      include: {
        items: true
      }
    });

    this.emitOrderStatus(order);
    return order;
  }

  static async emitOrderStatus(order: any) {
    const { getIO } = await import("../../lib/socket.ts");
    const payload = {
      orderId: order.id,
      terminal_id: order.terminal_id,
      status: order.status,
      branchId: order.branchId
    };
    getIO().to(`branch_${order.branchId}`).emit("order_status", payload);
  }

  static async updateStatus(orderId: string, status: string, estimated_time?: number) {
    const updatedOrder = await OrderLifecycleService.updateStatus(
      orderId,
      status,
      estimated_time ? new Date(Date.now() + estimated_time * 60000) : undefined
    );

    if (status === "preparing") {
      try {
        const { PrintService } = await import("../../services/print/print.service.ts");
        await PrintService.printOrder(updatedOrder.id);
      } catch (error) {
        console.error("Failed to print order:", error);
      }
    }

    OrderSocket.orderUpdated(updatedOrder);
    return updatedOrder;
  }

  static async courierPickup(orderId: string) {
    const updatedOrder = await OrderLifecycleService.updateStatus(orderId, "picked_up");
    OrderSocket.orderUpdated(updatedOrder);
    return updatedOrder;
  }

  static async getActiveOrders() {
    return prisma.order.findMany({
      where: {
        status: {
          in: ["pending", "accepted", "preparing", "ready_for_pickup"]
        }
      },
      orderBy: { createdAt: "asc" },
      include: {
        items: true
      }
    });
  }

  static async getOrderById(orderId: string) {
    return prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true
      }
    });
  }
}




