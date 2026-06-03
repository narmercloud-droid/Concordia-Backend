import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function setMinimumOrder(req, res) {
  const { branchId } = req.params;
  const { minimumOrder } = req.body;
  if (minimumOrder == null) return res.status(400).json({ error: 'minimumOrder is required' });
  try {
    const cur = (await prisma.branchConfig.findUnique({ where: { branchId } }))?.configJson ?? {};
    const data = { ...cur, minimumOrder };
    const updated = await prisma.branchConfig.upsert({ where: { branchId }, update: { configJson: data }, create: { branchId, configJson: data } });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
