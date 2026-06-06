import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createCategory(req, res) {
  const { branchId } = req.params;
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  try {
    const category = await prisma.branchCategory.create({ data: { branchId, name } });
    return res.status(201).json(category);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function updateCategory(req, res) {
  const { categoryId } = req.params;
  const { name } = req.body;
  const id = parseInt(categoryId, 10);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'invalid categoryId' });
  try {
    const updated = await prisma.branchCategory.update({ where: { id }, data: { name } });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function deleteCategory(req, res) {
  const { categoryId } = req.params;
  const id = parseInt(categoryId, 10);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'invalid categoryId' });
  try {
    await prisma.branchCategory.delete({ where: { id } });
    return res.status(204).end();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
