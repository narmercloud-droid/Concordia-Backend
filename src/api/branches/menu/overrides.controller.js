import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function findBranchMenuItem(branchId, menuItemId) {
  return prisma.branchMenuItem.findFirst({ where: { branchId, menuItemId } });
}

export async function updatePrice(req, res) {
  const { branchId, itemId } = req.params;
  const { price } = req.body;
  const menuItemId = parseInt(itemId, 10);
  if (Number.isNaN(menuItemId)) return res.status(400).json({ error: 'invalid itemId' });
  try {
    const bmi = await findBranchMenuItem(branchId, menuItemId);
    if (!bmi) return res.status(404).json({ error: 'branch menu item not found' });
    const updated = await prisma.branchMenuItem.update({ where: { id: bmi.id }, data: { price } });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function updateAvailability(req, res) {
  const { branchId, itemId } = req.params;
  const { isAvailable } = req.body;
  const menuItemId = parseInt(itemId, 10);
  if (Number.isNaN(menuItemId)) return res.status(400).json({ error: 'invalid itemId' });
  try {
    const bmi = await findBranchMenuItem(branchId, menuItemId);
    if (!bmi) return res.status(404).json({ error: 'branch menu item not found' });
    const updated = await prisma.branchMenuItem.update({ where: { id: bmi.id }, data: { isAvailable } });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function updateDescription(req, res) {
  const { branchId, itemId } = req.params;
  const { description } = req.body;
  const menuItemId = parseInt(itemId, 10);
  if (Number.isNaN(menuItemId)) return res.status(400).json({ error: 'invalid itemId' });
  try {
    const bmi = await findBranchMenuItem(branchId, menuItemId);
    if (!bmi) return res.status(404).json({ error: 'branch menu item not found' });
    const updated = await prisma.branchMenuItem.update({ where: { id: bmi.id }, data: { description } });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function updateImage(req, res) {
  const { branchId, itemId } = req.params;
  const { imageUrl } = req.body;
  const menuItemId = parseInt(itemId, 10);
  if (Number.isNaN(menuItemId)) return res.status(400).json({ error: 'invalid itemId' });
  try {
    const bmi = await findBranchMenuItem(branchId, menuItemId);
    if (!bmi) return res.status(404).json({ error: 'branch menu item not found' });
    const updated = await prisma.branchMenuItem.update({ where: { id: bmi.id }, data: { imageUrl } });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
