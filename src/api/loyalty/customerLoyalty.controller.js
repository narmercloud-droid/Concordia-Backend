import { PrismaClient } from '@prisma/client';
import { redeemReward } from '../../services/loyalty/loyalty.service.js';
import { getSettings } from '../../services/loyalty/settings.service.js';

const prisma = new PrismaClient();

export async function getLoyaltyInfo(req, res) {
  const { userId } = req.params;

  const user = await prisma.customer.findUnique({ where: { id: userId } });
  const rewards = await prisma.reward.findMany({ where: { isActive: true } });
  const settings = await getSettings();

  res.json({ user, rewards, settings });
}

export async function redeem(req, res) {
  const { userId, rewardId } = req.body;

  const result = await redeemReward(userId, rewardId);

  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  res.json(result);
}
