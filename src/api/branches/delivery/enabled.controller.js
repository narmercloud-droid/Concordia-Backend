import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function toggleDelivery(req, res) {
  const { branchId } = req.params;
  try {
    const cfg = await prisma.branchConfig.findUnique({ where: { branchId } });
    const cur = cfg?.configJson ?? {};
    const enabled = !cur.deliveryEnabled;
    const data = { ...cur, deliveryEnabled: enabled };
    const updated = await prisma.branchConfig.upsert({ where: { branchId }, update: { configJson: data }, create: { branchId, configJson: data } });
    return res.json({ deliveryEnabled: updated.configJson.deliveryEnabled });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
