import { prisma } from "../../prisma/client.js";

export class CustomerAnalyticsService {
  /**
   * Update customer statistics after an order is completed
   */
  static async updateCustomerStats(order: any): Promise<void> {
    if (!order.customerId || order.isGuest) {
      return; // Skip analytics for guest orders
    }

    const customerId = order.customerId;
    const orderTotal = order.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    // Get existing analytics or create new
    let analytics = await prisma.customerAnalytics.findUnique({
      where: { customerId }
    });

    if (!analytics) {
      analytics = await prisma.customerAnalytics.create({
        data: {
          customerId,
          totalOrders: 0,
          totalSpend: 0,
          avgOrderValue: 0,
          lastOrderDate: new Date(),
          churnRiskScore: 0,
          lifetimeValueScore: 0
        }
      });
    }

    // Update statistics
    const newTotalOrders = analytics.totalOrders + 1;
    const newTotalSpend = analytics.totalSpend + orderTotal;
    const newAvgOrderValue = newTotalSpend / newTotalOrders;

    // Calculate churn risk (simplified heuristic)
    const daysSinceLastOrder = analytics.lastOrderDate 
      ? Math.floor((new Date().getTime() - new Date(analytics.lastOrderDate).getTime()) / (1000 * 60 * 60 * 24))
      : 30;
    
    // Higher churn risk if no orders for a while
    const churnRiskScore = Math.min(1, daysSinceLastOrder / 30); // Normalize to 0-1

    // Calculate lifetime value (simplified)
    const lifetimeValueScore = newTotalSpend * 0.1; // Simple multiplier

    await prisma.customerAnalytics.update({
      where: { customerId },
      data: {
        totalOrders: newTotalOrders,
        totalSpend: newTotalSpend,
        avgOrderValue: newAvgOrderValue,
        lastOrderDate: new Date(),
        churnRiskScore,
        lifetimeValueScore
      }
    });
  }

  /**
   * Calculate churn risk for a customer
   */
  static async calculateChurnRisk(customerId: string): Promise<number> {
    const analytics = await prisma.customerAnalytics.findUnique({
      where: { customerId }
    });

    if (!analytics) {
      return 0; // New customer, low churn risk
    }

    const daysSinceLastOrder = analytics.lastOrderDate 
      ? Math.floor((new Date().getTime() - new Date(analytics.lastOrderDate).getTime()) / (1000 * 60 * 60 * 24))
      : 30;

    // Churn risk increases with days since last order
    let riskScore = Math.min(1, daysSinceLastOrder / 30);
    
    // Adjust based on order frequency
    if (analytics.totalOrders > 10) {
      riskScore *= 0.7; // Loyal customers have lower risk
    } else if (analytics.totalOrders < 3) {
      riskScore *= 1.3; // New customers have higher risk
    }

    return Math.min(1, Math.max(0, riskScore));
  }

  /**
   * Calculate lifetime value for a customer
   */
  static async calculateLifetimeValue(customerId: string): Promise<number> {
    const analytics = await prisma.customerAnalytics.findUnique({
      where: { customerId }
    });

    if (!analytics) {
      return 0;
    }

    // Simple LTV calculation: total spend * retention multiplier
    const retentionMultiplier = analytics.totalOrders > 5 ? 1.5 : 1.0;
    const ltv = analytics.totalSpend * retentionMultiplier;

    return ltv;
  }

  /**
   * Get customer analytics summary
   */
  static async getCustomerAnalytics(customerId: string) {
    return prisma.customerAnalytics.findUnique({
      where: { customerId }
    });
  }
}