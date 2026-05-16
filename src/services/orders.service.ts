import { prisma } from "../prisma/client.js";
import { v4 as uuid } from "uuid";

const COURIER_TOKEN_VALIDITY_MS = 60 * 60 * 1000; // 1 hour

export class OrdersService {
  async createOrder(data) {
    const { items, ...orderData } = data;

    const order = await prisma.order.create({
      data: {
        ...orderData,
        items: {
          create: items.map(i => ({
            itemId: i.itemId,
            variantId: i.variantId,
            addOnIds: i.addOnIds || [],
            quantity: i.quantity,
            notes: i.notes || null,
            price: i.price
          }))
        }
      },
      include: { items: true }
    });

    return order;
  }

  async listBranchOrders(branchId) {
    return prisma.order.findMany({
      where: { branchId },
      orderBy: { createdAt: "desc" },
      include: { items: true }
    });
  }

  async updateStatus(orderId, status) {
    return prisma.order.update({
      where: { id: orderId },
      data: { status }
    });
  }

  async generateCourierToken(orderId) {
    const token = uuid();
    const expiresAt = new Date(Date.now() + COURIER_TOKEN_VALIDITY_MS);

    return prisma.order.update({
      where: { id: orderId },
      data: {
        courierToken: token,
        courierTokenExpiresAt: expiresAt
      }
    });
  }

  async validateCourierToken(orderId, token) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return false;
    if (order.courierToken !== token) return false;
    if (!order.courierTokenExpiresAt) return false;
    if (order.courierTokenExpiresAt < new Date()) return false;
    return order;
  }

  async courierPickedUp(orderId) {
    return prisma.order.update({
      where: { id: orderId },
      data: {
        status: "picked_up",
        courierStatus: "picked_up"
      }
    });
  }

  async courierDelivered(orderId) {
    return prisma.order.update({
      where: { id: orderId },
      data: {
        status: "delivered",
        courierStatus: "delivered"
      }
    });
  }
}

export const ordersService = new OrdersService();
