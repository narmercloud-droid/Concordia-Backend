import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function setFreeDelivery(req, res) {
  const { branchId } = req.params;
  const { freeDeliveryThreshold } = req.body;
  if (freeDeliveryThreshold == null) return res.status(400).json({ error: 'freeDeliveryThreshold is required' });
  try {
    const cur = (await prisma.branchConfig.findUnique({ where: { branchId } }))?.configJson ?? {};
    const data = { ...cur, freeDeliveryThreshold };
    const updated = await prisma.branchConfig.upsert({ where: { branchId }, update: { configJson: data }, create: { branchId, configJson: data } });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
