import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAssignedOrders(req, res) {
  const { driverId } = req.params;

  const orders = await prisma.order.findMany({
    where: { driverId },
    include: { branch: true }
  });

  res.json({ orders });
}
