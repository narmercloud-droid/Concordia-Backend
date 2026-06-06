import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function setFlatFee(req, res) {
  const { branchId } = req.params;
  const { flatFee } = req.body;
  if (flatFee == null) return res.status(400).json({ error: 'flatFee is required' });
  try {
    const cur = (await prisma.branchConfig.findUnique({ where: { branchId } }))?.configJson ?? {};
    const data = { ...cur, flatFee };
    const updated = await prisma.branchConfig.upsert({ where: { branchId }, update: { configJson: data }, create: { branchId, configJson: data } });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function setDistanceFee(req, res) {
  // Stub: distance fee calculation not implemented yet
  return res.status(501).json({ error: 'distance fee not implemented' });
}
