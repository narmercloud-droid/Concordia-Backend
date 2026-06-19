import { PrismaClient } from '@prisma/client';
import { bumpAllBranchMenus } from './customerCacheBump.js';
const prisma = new PrismaClient();

export async function createCategory(req, res) {
  const category = await prisma.category.create({ data: req.body });
  await bumpAllBranchMenus();
  res.json(category);
}

export async function updateCategory(req, res) {
  const { categoryId } = req.params;
  const category = await prisma.category.update({
    where: { id: categoryId },
    data: req.body
  });
  await bumpAllBranchMenus();
  res.json(category);
}

export async function deleteCategory(req, res) {
  const { categoryId } = req.params;
  await prisma.category.delete({ where: { id: categoryId } });
  await bumpAllBranchMenus();
  res.json({ success: true });
}

export async function createItem(req, res) {
  const item = await prisma.menuItem.create({ data: req.body });
  await bumpAllBranchMenus();
  res.json(item);
}

export async function updateItem(req, res) {
  const { itemId } = req.params;
  const item = await prisma.menuItem.update({
    where: { id: itemId },
    data: req.body
  });
  await bumpAllBranchMenus();
  res.json(item);
}

export async function deleteItem(req, res) {
  const { itemId } = req.params;
  await prisma.menuItem.delete({ where: { id: itemId } });
  await bumpAllBranchMenus();
  res.json({ success: true });
}

export async function uploadCategoryImage(req, res) {
  const { categoryId } = req.params;
  const imageUrl = req.file.location;

  const category = await prisma.category.update({
    where: { id: categoryId },
    data: { imageUrl }
  });

  await bumpAllBranchMenus();
  res.json(category);
}

export async function uploadItemImage(req, res) {
  const { itemId } = req.params;
  const imageUrl = req.file.location;

  const item = await prisma.menuItem.update({
    where: { id: itemId },
    data: { imageUrl }
  });

  await bumpAllBranchMenus();
  res.json(item);
}
