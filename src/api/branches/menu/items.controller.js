import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createMenuItem(req, res) {
  const { branchId } = req.params;
  const { name, description, baseImage, basePrice, branchPrice, branchDescription, branchImageUrl, categoryId } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  try {
    const menuItem = await prisma.menuItem.create({ data: { name, description: description ?? null, baseImage: baseImage ?? null, basePrice: basePrice ?? null } });

    // create branch override
    await prisma.branchMenuItem.create({ data: {
      branchId,
      menuItemId: menuItem.id,
      price: branchPrice ?? menuItem.basePrice ?? null,
      description: branchDescription ?? null,
      imageUrl: branchImageUrl ?? null,
      isAvailable: true,
      categoryId: categoryId ?? null,
    } });

    return res.status(201).json(menuItem);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function updateMenuItem(req, res) {
  const { itemId } = req.params;
  const id = parseInt(itemId, 10);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'invalid itemId' });
  const { name, description, baseImage, basePrice } = req.body;
  try {
    const updated = await prisma.menuItem.update({ where: { id }, data: { name, description, baseImage, basePrice } });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function deleteMenuItem(req, res) {
  const { itemId } = req.params;
  const id = parseInt(itemId, 10);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'invalid itemId' });
  try {
    await prisma.branchMenuItem.deleteMany({ where: { menuItemId: id } });
    await prisma.menuItem.delete({ where: { id } });
    return res.status(204).end();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
