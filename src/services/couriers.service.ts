import { prisma } from "../prisma/client.js";
import { v4 as uuid } from "uuid";

const TOKEN_VALIDITY_MS = 60 * 60 * 1000; // 1 hour

export class CourierService {
  async generateCourierToken(orderId: string): Promise<any> {
    const token = uuid();
    const expiresAt = new Date(Date.now() + TOKEN_VALIDITY_MS);

    return prisma.order.update({
      where: { id: orderId },
      data: {
        courierToken: token,
        courierTokenExpiresAt: expiresAt
      }
    });
  }

  async validateCourierToken(orderId: string, token: string): Promise<any> {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return null;
    if (order.courierToken !== token) return null;
    if (!order.courierTokenExpiresAt) return null;
    if (order.courierTokenExpiresAt < new Date()) return null;
    return order;
  }

  async claimOrder(orderId: string): Promise<any> {
    return prisma.order.update({
      where: { id: orderId },
      data: { courierStatus: "accepted" }
    });
  }

  async updateStatus(orderId: string, status: string): Promise<any> {
    return prisma.order.update({
      where: { id: orderId },
      data: { courierStatus: status }
    });
  }
}

export const courierService = new CourierService();

