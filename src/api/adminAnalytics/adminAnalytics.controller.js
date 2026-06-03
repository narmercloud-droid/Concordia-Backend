import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getPlatformAnalytics(req, res) {
  try {
    const totalOrders = await prisma.order.count();
    const revenue = await prisma.order.aggregate({
      _sum: { orderTotal: true }
    });

    const branches = await prisma.branch.findMany({
      include: {
        orders: true
      }
    });

    res.json({
      totalOrders,
      revenue: revenue._sum.orderTotal || 0,
      branches
    });

  } catch (error) {
    console.error('Admin analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
