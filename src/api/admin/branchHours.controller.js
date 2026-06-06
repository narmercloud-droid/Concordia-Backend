import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function setBranchHours(req, res) {
  const { branchId } = req.params;
  const { dayOfWeek, openTime, closeTime } = req.body;

  const hours = await prisma.branchHours.upsert({
    where: {
      branchId_dayOfWeek: {
        branchId: branchId,
        dayOfWeek
      }
    },
    update: { openTime, closeTime },
    create: {
      branchId: branchId,
      dayOfWeek,
      openTime,
      closeTime
    }
  });

  res.json(hours);
}

export async function getBranchHours(req, res) {
  const { branchId } = req.params;

  const hours = await prisma.branchHours.findMany({
    where: { branchId: branchId },
    orderBy: { dayOfWeek: 'asc' }
  });

  res.json(hours);
}
