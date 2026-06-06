import { PrismaClient } from '@prisma/client';
import { updateDriverRating } from '../../services/drivers/performance.service.js';

const prisma = new PrismaClient();

export async function rateDriver(req, res) {
  const { driverId, orderId, rating, comment } = req.body;

  const entry = await prisma.driverRating.upsert({
    where: { driverId_orderId: { driverId, orderId } },
    update: { rating, comment },
    create: { driverId, orderId, rating, comment }
  });

  await updateDriverRating(driverId);

  res.json(entry);
}
