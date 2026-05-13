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
    if (order.total > 100) {
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
        customerId: order.customerId,
        promoCode: { not: null }
      }
    });

    if (promoUses > 10) {
      score += 20;
      events.push("Promo abuse");
    }

    // Loyalty abuse
    if (order.loyaltyPointsUsed > 5000) {
      score += 30;
      events.push("Loyalty abuse");
    }

    // Determine level
    let level = "low";
    if (score >= 30) level = "medium";
    if (score >= 60) level = "high";
    if (score >= 90) level = "extreme";

    // Save risk score
    await prisma.riskScore.upsert({
      where: { orderId },
      update: { score, level },
      create: { orderId, score, level }
    });

    // Save events
    for (const e of events) {
      await prisma.orderRiskEvent.create({
        data: { orderId, event: e }
      });
    }

    // Auto-flag extreme
    if (level === "extreme") {
      await prisma.fraudFlag.create({
        data: {
          orderId,
          customerId: order.customerId,
          reason: "Extreme risk score"
        }
      });
    }

    return { score, level, events };
  }

  async getRisk(orderId) {
    return prisma.riskScore.findUnique({
      where: { orderId }
    });
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

