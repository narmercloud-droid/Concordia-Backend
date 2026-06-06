import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function updateDriverRating(driverId) {
  const ratings = await prisma.driverRating.findMany({
    where: { driverId }
  });

  if (!ratings.length) return;

  const avg = ratings.reduce((a, b) => a + b.rating, 0) / ratings.length;

  await prisma.driver.update({
    where: { id: driverId },
    data: {
      ratingAverage: avg,
      ratingCount: ratings.length
    }
  });
}

export async function updateDriverDeliveryStats(driverId) {
  const completed = await prisma.order.findMany({
    where: {
      driverId,
      status: 'delivered',
      deliveredAt: { not: null },
      pickedUpAt: { not: null }
    }
  });

  if (!completed.length) return;

  const times = completed.map(o => (o.deliveredAt.getTime() - o.pickedUpAt.getTime()) / 60000);

  const avgTime = Math.round(times.reduce((a, b) => a + b) / times.length);

  const onTime = completed.filter(o => o.etaDeliveredAt && o.deliveredAt <= o.etaDeliveredAt).length;
  const onTimeRate = onTime / completed.length;

  await prisma.driver.update({
    where: { id: driverId },
    data: {
      avgDeliveryTime: avgTime,
      onTimeRate,
      completedOrders: completed.length
    }
  });
}

export async function recordDriverCancellation(driverId) {
  await prisma.driver.update({
    where: { id: driverId },
    data: {
      cancelledOrders: { increment: 1 }
    }
  });
}
