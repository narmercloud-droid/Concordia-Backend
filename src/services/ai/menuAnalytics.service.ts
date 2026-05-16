import { prisma } from "../../prisma/client.js";

export class MenuAnalyticsService {
  /**
   * Update menu item statistics after an order is completed
   */
  static async updateMenuItemStats(order: any): Promise<void> {
    if (!order.items || order.items.length === 0) {
      return;
    }

    for (const orderItem of order.items) {
      const itemId = orderItem.itemId;
      const itemRevenue = orderItem.price * orderItem.quantity;

      // Get existing analytics or create new
      let analytics = await prisma.menuItemAnalytics.findUnique({
        where: { itemId }
      });

      if (!analytics) {
        analytics = await prisma.menuItemAnalytics.create({
          data: {
            itemId,
            totalOrders: 0,
            totalRevenue: 0,
            popularityScore: 0,
            lastOrderedAt: new Date()
          }
        });
      }

      // Update statistics
      const newTotalOrders = analytics.totalOrders + orderItem.quantity;
      const newTotalRevenue = analytics.totalRevenue + itemRevenue;

      // Calculate popularity score based on recent orders
      const daysSinceLastOrder = analytics.lastOrderedAt 
        ? Math.floor((new Date().getTime() - new Date(analytics.lastOrderedAt).getTime()) / (1000 * 60 * 60 * 24))
        : 30;
      
      // Higher popularity for recent orders
      const recencyBoost = Math.max(0.5, 1 - (daysSinceLastOrder / 30));
      const popularityScore = (newTotalOrders * 0.6 + newTotalRevenue * 0.01) * recencyBoost;

      await prisma.menuItemAnalytics.update({
        where: { itemId },
        data: {
          totalOrders: newTotalOrders,
          totalRevenue: newTotalRevenue,
          popularityScore: Math.min(100, popularityScore),
          lastOrderedAt: new Date()
        }
      });
    }
  }

  /**
   * Calculate popularity score for a menu item
   */
  static async calculatePopularity(itemId: string): Promise<number> {
    const analytics = await prisma.menuItemAnalytics.findUnique({
      where: { itemId }
    });

    if (!analytics) {
      return 0;
    }

    return analytics.popularityScore;
  }

  /**
   * Get top items for a branch
   */
  static async getTopItems(branchId: string, limit: number = 10) {
    // Get all menu items for the branch
    const menuItems = await prisma.menuItem.findMany({
      include: {
        menuItemAnalytics: true
      }
    });

    const sortedItems = menuItems
      .map(item => ({
        ...item,
        popularityScore: item.menuItemAnalytics?.popularityScore || 0
      }))
      .sort((a, b) => b.popularityScore - a.popularityScore)
      .slice(0, limit);

    return sortedItems;
  }

  /**
   * Get menu item analytics summary
   */
  static async getMenuAnalytics(itemId: string) {
    return prisma.menuItemAnalytics.findUnique({
      where: { itemId }
    });
  }
}