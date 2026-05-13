import { prisma } from "../prisma/client.js";

export class BehaviorPredictionService {
  // 1. Next order prediction
  async nextOrder(customerId: string): Promise<any> {
    const items = await prisma.orderItem.findMany({
      where: { order: { customerId } },
      select: { itemId: true }
    });

    if (items.length === 0) return { prediction: null };

    const freq: Record<string, number> = {};
    for (const i of items) {
      freq[i.itemId] = (freq[i.itemId] || 0) + 1;
    }

    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    const topItemId = sorted[0][0];

    const item = await prisma.menuItem.findUnique({ where: { id: topItemId } });

    return {
      itemId: item?.id,
      name: item?.name,
      confidence: Math.min(0.95, sorted[0][1] / items.length)
    };
  }

  // 2. Next visit time prediction
  async nextVisit(customerId: string): Promise<any> {
    const orders = await prisma.order.findMany({
      where: { customerId },
      orderBy: { createdAt: "asc" }
    });

    if (orders.length < 2) return { prediction: null };

    const intervals = [];
    for (let i = 1; i < orders.length; i++) {
      const diff = orders[i].createdAt.getTime() - orders[i - 1].createdAt.getTime();
      intervals.push(diff);
    }

    const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;

    const next = new Date(Date.now() + avg);

    return {
      expectedDate: next,
      confidence: 0.7
    };
  }

  // 3. Branch preference prediction
  async branchPreference(customerId: string) {
    const orders = await prisma.order.groupBy({
      by: ["branchId"],
      _count: { branchId: true },
      where: { customerId }
    });

    if (orders.length === 0) return { prediction: null };

    const sorted = orders.sort((a, b) => b._count.branchId - a._count.branchId);

    return {
      branchId: sorted[0].branchId,
      confidence: sorted[0]._count.branchId / orders.length
    };
  }

  // 4. Promo sensitivity prediction
  async promoSensitivity(customerId: string) {
    const orders = await prisma.order.findMany({ where: { customerId } });
    if (orders.length === 0) return { sensitivity: "none", ratio: 0 };

    return { sensitivity: "none", ratio: 0 };
  }

  // 5. Full behavior profile
  async fullProfile(customerId) {
    return {
      nextOrder: await this.nextOrder(customerId),
      nextVisit: await this.nextVisit(customerId),
      branchPreference: await this.branchPreference(customerId),
      promoSensitivity: await this.promoSensitivity(customerId)
    };
  }
}

export const behaviorPredictionService = new BehaviorPredictionService();
