import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getBranchDashboard(req, res) {
  const { branchId } = req.params;

  const orders = await prisma.order.findMany({
    where: { branchId },
    include: { driver: true }
  });

  const drivers = await prisma.driver.findMany({
    where: { branchId }
  });

  res.json({
    orders,
    drivers
  });
}
