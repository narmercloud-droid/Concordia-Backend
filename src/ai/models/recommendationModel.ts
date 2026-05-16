/**
 * Recommendation Model
 * Uses simple heuristics for item recommendations
 */

import { prisma } from "../../prisma/client.js";

export class RecommendationModel {
  /**
   * Recommend items for a customer at a specific branch
   * Uses popularity, customer preferences, and time-based recommendations
   */
  static async recommendItems(customerId: string, branchId: string, limit: number = 5): Promise<any[]> {
    try {
      // Get customer favorites
      const favorites = await prisma.favorite.findMany({
        where: { customerId },
        select: { itemId: true }
      });
      const favoriteItemIds = favorites.map(f => f.itemId);

      // Get top popular items for the branch
      const topItems = await prisma.menuItemAnalytics.findMany({
        include: {
          item: true
        },
        orderBy: { popularityScore: 'desc' },
        take: 20
      });

      // Get customer's order history
      const customerOrders = await prisma.order.findMany({
        where: {
          customerId,
          status: { in: ["delivered", "completed"] }
        },
        include: {
          items: true
        }
      });

      // Extract frequently ordered items
      const itemCounts: { [itemId: string]: number } = {};
      customerOrders.forEach(order => {
        order.items.forEach(item => {
          itemCounts[item.itemId] = (itemCounts[item.itemId] || 0) + item.quantity;
        });
      });

      // Score items based on multiple factors
      const scoredItems = topItems.map(analytics => {
        const item = analytics.item;
        let score = analytics.popularityScore;

        // Boost if customer has ordered before
        if (itemCounts[item.id]) {
          score += itemCounts[item.id] * 10;
        }

        // Boost if item is in favorites
        if (favoriteItemIds.includes(item.id)) {
          score += 20;
        }

        // Boost based on time of day
        const hour = new Date().getHours();
        if (hour >= 11 && hour <= 13 && item.categoryId) {
          // Lunch items boost
          score += 5;
        } else if (hour >= 18 && hour <= 20 && item.categoryId) {
          // Dinner items boost
          score += 5;
        }

        return {
          ...item,
          score,
          analytics: analytics
        };
      });

      // Sort by score and return top items
      return scoredItems
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
    } catch (error) {
      console.error("Error generating recommendations:", error);
      return [];
    }
  }

  /**
   * Get complementary items (items often ordered together)
   */
  static async getComplementaryItems(itemId: string, branchId: string, limit: number = 3): Promise<any[]> {
    try {
      // Find orders containing this item
      const ordersWithItem = await prisma.orderItem.findMany({
        where: {
          itemId,
          order: {
            branchId,
            status: { in: ["delivered", "completed"] }
          }
        },
        include: {
          order: {
            include: {
              items: true
            }
          }
        }
      });

      // Count co-occurrences
      const coOccurrenceCounts: { [itemId: string]: number } = {};
      ordersWithItem.forEach(orderItem => {
        orderItem.order.items.forEach(item => {
          if (item.itemId !== itemId) {
            coOccurrenceCounts[item.itemId] = (coOccurrenceCounts[item.itemId] || 0) + 1;
          }
        });
      });

      // Get top co-occurring items
      const topCoOccurring = Object.entries(coOccurrenceCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit);

      // Fetch item details
      const complementaryItems = await Promise.all(
        topCoOccurring.map(async ([itemId, count]) => {
          const item = await prisma.menuItem.findUnique({
            where: { id: itemId }
          });
          return { ...item, coOccurrenceCount: count };
        })
      );

      return complementaryItems.filter(item => item !== null);
    } catch (error) {
      console.error("Error getting complementary items:", error);
      return [];
    }
  }
}