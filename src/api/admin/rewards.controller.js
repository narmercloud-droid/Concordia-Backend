import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function createReward(req, res) {
  const reward = await prisma.reward.create({ data: req.body });
  res.json(reward);
}

export async function updateReward(req, res) {
  const { rewardId } = req.params;
  const reward = await prisma.reward.update({
    where: { id: rewardId },
    data: req.body
  });
  res.json(reward);
}

export async function listRewards(req, res) {
  const rewards = await prisma.reward.findMany();
  res.json(rewards);
}

export async function deleteReward(req, res) {
  const { rewardId } = req.params;
  await prisma.reward.delete({ where: { id: rewardId } });
  res.json({ success: true });
}
