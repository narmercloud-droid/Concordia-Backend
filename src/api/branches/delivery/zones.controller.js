import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getZones(req, res) {
  const { branchId } = req.params;
  try {
    const zones = await prisma.branchDeliveryZone.findMany({ where: { branchId } });
    return res.json(zones);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function createZone(req, res) {
  const { branchId } = req.params;
  const { name, polygon, maxDistanceKm, baseFee, perKmFee, freeDeliveryThreshold, minimumOrderAmount } = req.body;
  if (!name || !polygon) return res.status(400).json({ error: 'name and polygon are required' });
  try {
    const zone = await prisma.branchDeliveryZone.create({ data: {
      branchId,
      name,
      polygon: polygon as any,
      maxDistanceKm: maxDistanceKm ?? 0,
      baseFee: baseFee ?? 0,
      perKmFee: perKmFee ?? 0,
      freeDeliveryThreshold: freeDeliveryThreshold ?? null,
      minimumOrderAmount: minimumOrderAmount ?? null,
    } });
    return res.status(201).json(zone);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function updateZone(req, res) {
  const { zoneId } = req.params;
  const id = parseInt(zoneId, 10);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'invalid zoneId' });
  const { name, polygon, maxDistanceKm, baseFee, perKmFee, freeDeliveryThreshold, minimumOrderAmount } = req.body;
  try {
    const updated = await prisma.branchDeliveryZone.update({ where: { id }, data: {
      name,
      polygon: polygon as any,
      maxDistanceKm,
      baseFee,
      perKmFee,
      freeDeliveryThreshold,
      minimumOrderAmount,
    } });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function deleteZone(req, res) {
  const { zoneId } = req.params;
  const id = parseInt(zoneId, 10);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'invalid zoneId' });
  try {
    await prisma.branchDeliveryZone.delete({ where: { id } });
    return res.status(204).end();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
