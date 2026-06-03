import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getMenu(req, res) {
  try {
    const items = await prisma.menuItem.findMany({
      include: { category: true }
    });
    res.json(items);
  } catch (error) {
    console.error('Get menu error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createMenuItem(req, res) {
  try {
    const { name, price, categoryId, imageUrl, available } = req.body;

    const item = await prisma.menuItem.create({
      data: { name, price, categoryId, imageUrl, available }
    });

    res.json({ success: true, item });
  } catch (error) {
    console.error('Create menu item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateMenuItem(req, res) {
  try {
    const { itemId } = req.params;
    const data = req.body;

    const item = await prisma.menuItem.update({
      where: { id: itemId },
      data
    });

    res.json({ success: true, item });
  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteMenuItem(req, res) {
  try {
    const { itemId } = req.params;

    await prisma.menuItem.delete({
      where: { id: itemId }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
