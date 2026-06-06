import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function setAvailability(req, res) {
  const { driverId } = req.params;
  const { isAvailable } = req.body;

  const driver = await prisma.driver.update({
    where: { id: driverId },
    data: { isAvailable }
  });

  res.json({ driver });
}

export async function getAvailability(req, res) {
  const { driverId } = req.params;
  const driver = await prisma.driver.findUnique({ where: { id: driverId } });
  res.json({ isAvailable: driver?.isAvailable });
}
