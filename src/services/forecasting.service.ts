import { prisma } from "../prisma/client.js";

export class ForecastingService {
  // Utility: group orders by hour
  groupByHour(orders: any[]): any {
    const map: any = {};
    for (const o of orders) {
      const hour = o.createdAt.getHours();
      map[hour] = (map[hour] || 0) + 1;
    }
    return map;
  }

  // Utility: group orders by weekday
  groupByWeekday(orders: any[]): any {
    const map: any = {};
    for (const o of orders) {
      const day = o.createdAt.getDay();
      map[day] = (map[day] || 0) + 1;
    }
    return map;
  }

  // 1. Forecast sales for next 24 hours
  async forecastNext24Hours(branchId: string): Promise<any[]> {
    const orders = await prisma.order.findMany({
      where: { branchId },
      select: { createdAt: true }
    });

    const hourly = this.groupByHour(orders);

    const forecast = [];
    for (let h = 0; h < 24; h++) {
      const avg = hourly[h] ? hourly[h] / 7 : 0;
      forecast.push({ hour: h, expectedOrders: Math.round(avg) });
    }

    return forecast;
  }

  // 2. Forecast next 7 days
  async forecastNext7Days(branchId: string): Promise<any[]> {
    const orders = await prisma.order.findMany({
      where: { branchId },
      select: { createdAt: true }
    });

    const weekday = this.groupByWeekday(orders);

    const forecast = [];
    for (let d = 0; d < 7; d++) {
      const avg = weekday[d] ? weekday[d] / 4 : 0;
      forecast.push({ day: d, expectedOrders: Math.round(avg) });
    }

    return forecast;
  }

  // 3. Item-level demand forecasting
  async forecastItemDemand(branchId) {
    const items = await prisma.menuItem.findMany({
      where: { branchId },
      include: { orderItems: true }
    });

    return items.map(i => {
      const weeklySales = i.orderItems.length;
      const daily = weeklySales / 7;
      return {
        itemId: i.id,
        name: i.name,
        expectedDailySales: Math.round(daily)
      };
    });
  }

  // 4. Stock depletion forecasting
  async forecastStock(branchId) {
    const items = await prisma.menuItem.findMany({
      where: { branchId },
      include: { orderItems: true }
    });

    return items
      .filter(i => i.stock !== null)
      .map(i => {
        const weeklySales = i.orderItems.length;
        const daily = weeklySales / 7;
        const daysLeft = daily > 0 ? i.stock / daily : null;

        return {
          itemId: i.id,
          name: i.name,
          stock: i.stock,
          expectedDaysUntilOut: daysLeft ? daysLeft.toFixed(1) : "N/A"
        };
      });
  }

  // 5. Courier load forecasting
  async forecastCourierLoad(branchId) {
    const orders = await prisma.order.findMany({
      where: { branchId },
      select: { createdAt: true }
    });

    const hourly = this.groupByHour(orders);

    return Object.keys(hourly).map(h => ({
      hour: Number(h),
      expectedCouriersNeeded: Math.ceil(hourly[h] / 3)
    }));
  }

  // 6. Full forecasting summary
  async fullForecast(branchId) {
    return {
      next24Hours: await this.forecastNext24Hours(branchId),
      next7Days: await this.forecastNext7Days(branchId),
      itemDemand: await this.forecastItemDemand(branchId),
      stockForecast: await this.forecastStock(branchId),
      courierLoad: await this.forecastCourierLoad(branchId)
    };
  }
}

export const forecastingService = new ForecastingService();
