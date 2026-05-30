import { randomUUID } from "crypto";
import { prisma } from "../prisma/client.js";

export class FraudService {
  async scoreOrder(orderId: string): Promise<any> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { customer: true }
    });

    if (!order) throw new Error("Order not found");

    let score = 0;
    const events = [];

    // High-value order
    const orderAny = order as any;
    if (orderAny.total > 100) {
      score += 20;
      events.push("High value order");
    }

    // Too many orders in short time
    const recentOrders = await prisma.order.count({
      where: {
        customerId: order.customerId,
        createdAt: { gte: new Date(Date.now() - 1000 * 60 * 60) }
      }
    });

    if (recentOrders > 3) {
      score += 30;
      events.push("Velocity: too many orders");
    }

    // Failed payments
    const failedPayments = await prisma.order.count({
      where: {
        customerId: order.customerId,
        paymentStatus: "failed"
      }
    });

    if (failedPayments > 2) {
      score += 40;
      events.push("Multiple failed payments");
    }

    // Promo abuse
    const promoUses = await prisma.order.count({
      where: {
        customerId: order.customerId
      } as any
    });

    if (promoUses > 10) {
      score += 20;
      events.push("Promo abuse");
    }

    // Loyalty abuse
    if (orderAny.loyaltyPointsUsed > 5000) {
      score += 30;
      events.push("Loyalty abuse");
    }

    // Determine level
    let level = "low";
    if (score >= 30) level = "medium";
    if (score >= 60) level = "high";
    if (score >= 90) level = "extreme";

    // Save events
    for (const e of events) {
      await prisma.orderRiskEvent.create({
        data: {
          id: randomUUID(),
          event: e,
          order: { connect: { id: orderId } }
        }
      });
    }

    // Auto-flag extreme
    if (level === "extreme") {
      await prisma.fraudFlag.create({
        data: {
          id: randomUUID(),
          customerId: order.customerId,
          orderId,
          reason: "Extreme risk score"
        }
      });
    }

    return { score, level, events };
  }

  async getRisk(orderId) {
    // riskScore model is not defined in the current Prisma schema
    return null;
  }

  async getFlags() {
    return prisma.fraudFlag.findMany({
      orderBy: { createdAt: "desc" }
    });
  }

  async getOrderEvents(orderId) {
    return prisma.orderRiskEvent.findMany({
      where: { orderId },
      orderBy: { createdAt: "asc" }
    });
  }
}

export const fraudService = new FraudService();





