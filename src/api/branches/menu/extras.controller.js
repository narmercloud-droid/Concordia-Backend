import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function addExtra(req, res) {
  const { itemId } = req.params;
  const menuItemId = parseInt(itemId, 10);
  const { name, price } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  try {
    const extra = await prisma.menuItemExtra.create({ data: { menuItemId, name, price: price ?? null } });
    return res.status(201).json(extra);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function updateExtra(req, res) {
  const { extraId } = req.params;
  const id = parseInt(extraId, 10);
  const { name, price } = req.body;
  if (Number.isNaN(id)) return res.status(400).json({ error: 'invalid extraId' });
  try {
    const updated = await prisma.menuItemExtra.update({ where: { id }, data: { name, price } });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function deleteExtra(req, res) {
  const { extraId } = req.params;
  const id = parseInt(extraId, 10);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'invalid extraId' });
  try {
    await prisma.menuItemExtra.delete({ where: { id } });
    return res.status(204).end();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
