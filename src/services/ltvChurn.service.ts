import { prisma } from "../prisma/client.js";

type RfmResult = { recency: number; frequency: number; monetary: number };
type ChurnRisk = { score: number; level: string };
type SegmentResult = {
  segment: string;
  ltv: { avgOrderValue: number; predictedOrders: number; predictedLtv: number };
  churn: { score: number; level: string };
};

export class LtvChurnService {
  // 1. RFM scoring (branch-scoped when branchId provided)
  async rfm(customerId: string, branchId?: string): Promise<RfmResult> {
    const orders = await prisma.order.findMany({
      where: {
        customerId,
        ...(branchId ? { branchId } : {}),
      },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    });

    if (orders.length === 0) {
      return { recency: 0, frequency: 0, monetary: 0 };
    }

    const now = Date.now();
    const lastOrder = orders[0].createdAt.getTime();
    const recency = Math.round((now - lastOrder) / (1000 * 60 * 60 * 24));

    const frequency = orders.length;

    // Prisma schema does not have Order.total. Compute monetary value from OrderItem.
    const orderItems = await prisma.orderItem.findMany({
      where: {
        order: {
          customerId,
          ...(branchId ? { branchId } : {}),
        },
      },
      select: { price: true, quantity: true },
    });

    const monetary = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return { recency, frequency, monetary };
  }

  // 2. LTV prediction (branch-scoped when branchId provided)
  async predictLtv(
    customerId: string,
    branchId?: string
  ): Promise<{ avgOrderValue: number; predictedOrders: number; predictedLtv: number }> {
    const { frequency, monetary } = await this.rfm(customerId, branchId);

    const avgOrderValue = frequency > 0 ? monetary / frequency : 0;
    const predictedOrders = Math.min(50, frequency * 2);
    const predictedLtv = avgOrderValue * predictedOrders;

    return {
      avgOrderValue,
      predictedOrders,
      predictedLtv: Number(predictedLtv.toFixed(2)),
    };
  }

  // 3. Churn risk scoring (branch-scoped when branchId provided)
  async churnRisk(customerId: string, branchId?: string): Promise<ChurnRisk> {
    const { recency, frequency } = await this.rfm(customerId, branchId);

    let score = 0;

    if (recency > 30) score += 40;
    if (recency > 60) score += 60;
    if (frequency < 3) score += 20;

    let level = "low";
    if (score >= 40) level = "medium";
    if (score >= 70) level = "high";

    return { score, level };
  }

  // 4. Customer segmentation (branch-scoped when branchId provided)
  async segment(customerId: string, branchId?: string): Promise<SegmentResult> {
    const ltv = await this.predictLtv(customerId, branchId);
    const churn = await this.churnRisk(customerId, branchId);

    let segment = "low";

    if (ltv.predictedLtv > 500) segment = "VIP";
    else if (ltv.predictedLtv > 200) segment = "high";
    else if (ltv.predictedLtv > 50) segment = "medium";
    else segment = "low";

    if (churn.level === "high") segment = "at-risk";

    return { segment, ltv, churn };
  }

  // 5. Branch-level segmentation
  async branchSegments(branchId: string) {
    // Customer model has no branchId; derive branch-scoped customers from orders
    const orderCustomers = await prisma.order.findMany({
      where: { branchId, customerId: { not: null } },
      select: { customerId: true },
      distinct: ["customerId"],
    });

    const customerIds = orderCustomers.map(o => o.customerId!).filter(Boolean);

    const customers = await prisma.customer.findMany({
      where: { id: { in: customerIds } },
      select: { id: true },
    });

    // Preserve the existing response shape of { customerId, segment, ltv, churn }
    const expandedResults: Array<{ customerId: string } & SegmentResult> = [];

    for (const c of customers) {
      const full = await this.segment(c.id, branchId);
      expandedResults.push({ customerId: c.id, ...full });
    }

    return expandedResults;
  }
}

export const ltvChurnService = new LtvChurnService();

