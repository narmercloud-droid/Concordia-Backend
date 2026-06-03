import { PrismaClient } from '@prisma/client';
import { getSettings } from './settings.service.js';

const prisma = new PrismaClient();

export async function calculateTier(lifetimePoints) {
  const settings = await getSettings();

  if (lifetimePoints >= settings.platinumThreshold) return 'platinum';
  if (lifetimePoints >= settings.goldThreshold) return 'gold';
  if (lifetimePoints >= settings.silverThreshold) return 'silver';
  return 'bronze';
}

export async function addPoints(userId, orderTotal) {
  const settings = await getSettings();

  const points = Math.round(orderTotal * settings.pointsPerCurrency);

  const user = await prisma.customer.findUnique({ where: { id: userId } });

  if (!user) return null;

  const newTotal = (user.loyaltyPoints || 0) + points;
  const newLifetime = (user.lifetimePoints || 0) + points;

  const newTier = await calculateTier(newLifetime);

  return prisma.customer.update({
    where: { id: userId },
    data: {
      loyaltyPoints: newTotal,
      lifetimePoints: newLifetime,
      loyaltyTier: newTier
    }
  });
}

export async function redeemReward(userId, rewardId) {
  const user = await prisma.customer.findUnique({ where: { id: userId } });
  const reward = await prisma.reward.findUnique({ where: { id: rewardId } });

  if (!reward || !reward.isActive) {
    return { error: 'Reward not available' };
  }

  if ((user.loyaltyPoints || 0) < reward.costPoints) {
    return { error: 'Not enough points' };
  }

  await prisma.customer.update({
    where: { id: userId },
    data: {
      loyaltyPoints: (user.loyaltyPoints || 0) - reward.costPoints
    }
  });

  const redeemed = await prisma.userReward.create({ data: { userId, rewardId } });

  return { success: true, redeemed };
}
