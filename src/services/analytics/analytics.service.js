import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getOverviewStats() {
  const totalOrders = await prisma.order.count();
  const totalRevenue = await prisma.order.aggregate({
    _sum: { externalAmount: true }
  });

  const activeDrivers = await prisma.driver.count({
    where: { isAvailable: true }
  });

  const totalCustomers = await prisma.customer.count();

  return {
    totalOrders,
    totalRevenue: (totalRevenue._sum && totalRevenue._sum.externalAmount) || 0,
    activeDrivers,
    totalCustomers
  };
}

export async function getDailyOrders() {
  return prisma.order.groupBy({
    by: ['createdAt'],
    _count: { id: true },
    orderBy: { createdAt: 'asc' }
  });
}

export async function getBranchPerformance() {
  const branches = await prisma.branch.findMany();

  const results = [];

  for (const b of branches) {
    const orders = await prisma.order.count({ where: { branchId: b.id } });
    const revenue = await prisma.order.aggregate({
      where: { branchId: b.id },
      _sum: { externalAmount: true }
    });

    results.push({
      branchId: b.id,
      branchName: b.name,
      orders,
      revenue: (revenue._sum && revenue._sum.externalAmount) || 0,
      loadLevel: b.currentLoadLevel
    });
  }

  return results;
}

export async function getDriverPerformanceSummary() {
  const drivers = await prisma.driver.findMany();

  return drivers.map(d => ({
    id: d.id,
    name: d.name,
    rating: d.ratingAverage,
    completedOrders: d.completedOrders,
    cancelledOrders: d.cancelledOrders,
    onTimeRate: d.onTimeRate,
    avgDeliveryTime: d.avgDeliveryTime
  }));
}
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getBranchAnalytics(branchId) {
  const orders = await prisma.order.findMany({
    where: { branchId },
  });

  const totalOrders = orders.length;

  const kitchenTimes = orders
    .filter(o => o.preparingAt && o.readyAt)
    .map(o => o.readyAt - o.preparingAt);

  const deliveryTimes = orders
    .filter(o => o.pickedUpAt && o.deliveredAt)
    .map(o => o.deliveredAt - o.pickedUpAt);

  const avgKitchenTime = kitchenTimes.length
    ? Math.round(kitchenTimes.reduce((a, b) => a + b) / kitchenTimes.length)
    : 0;

  const avgDeliveryTime = deliveryTimes.length
    ? Math.round(deliveryTimes.reduce((a, b) => a + b) / deliveryTimes.length)
    : 0;

  const hourlyCounts = {};

  for (const order of orders) {
    if (!order.createdAt) continue;
    const hour = order.createdAt.getHours();
    hourlyCounts[hour] = (hourlyCounts[hour] || 0) + 1;
  }

  return {
    totalOrders,
    avgKitchenTime,
    avgDeliveryTime,
    hourlyCounts
  };
}
