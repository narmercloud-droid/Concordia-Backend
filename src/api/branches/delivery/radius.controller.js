import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getRadius(req, res) {
  const { branchId } = req.params;
  try {
    const cfg = await prisma.branchConfig.findUnique({ where: { branchId } });
    const radius = cfg?.configJson?.radius ?? null;
    return res.json({ radius });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function updateRadius(req, res) {
  const { branchId } = req.params;
  const { radius } = req.body;
  if (radius == null) return res.status(400).json({ error: 'radius is required' });
  try {
    const data = { ...(await prisma.branchConfig.findUnique({ where: { branchId } }))?.configJson, radius };
    const updated = await prisma.branchConfig.upsert({
      where: { branchId },
      update: { configJson: data },
      create: { branchId, configJson: data },
    });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function toggleRadius(req, res) {
  const { branchId } = req.params;
  try {
    const cfg = await prisma.branchConfig.findUnique({ where: { branchId } });
    const cur = cfg?.configJson ?? {};
    const enabled = !cur.radiusEnabled;
    const data = { ...cur, radiusEnabled: enabled };
    const updated = await prisma.branchConfig.upsert({
      where: { branchId },
      update: { configJson: data },
      create: { branchId, configJson: data },
    });
    return res.json({ radiusEnabled: updated.configJson.radiusEnabled });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
