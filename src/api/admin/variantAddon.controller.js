import { PrismaClient } from '@prisma/client';
import { bumpAllBranchMenus } from './customerCacheBump.js';
const prisma = new PrismaClient();

// VARIANT GROUPS
export async function createVariantGroup(req, res) {
  const group = await prisma.variantGroup.create({ data: req.body });
  await bumpAllBranchMenus();
  res.json(group);
}

export async function updateVariantGroup(req, res) {
  const { groupId } = req.params;
  const group = await prisma.variantGroup.update({
    where: { id: groupId },
    data: req.body
  });
  await bumpAllBranchMenus();
  res.json(group);
}

export async function deleteVariantGroup(req, res) {
  const { groupId } = req.params;
  await prisma.variantGroup.delete({ where: { id: groupId } });
  await bumpAllBranchMenus();
  res.json({ success: true });
}

// VARIANTS
export async function createVariant(req, res) {
  const variant = await prisma.variant.create({ data: req.body });
  await bumpAllBranchMenus();
  res.json(variant);
}

export async function updateVariant(req, res) {
  const { variantId } = req.params;
  const variant = await prisma.variant.update({
    where: { id: variantId },
    data: req.body
  });
  await bumpAllBranchMenus();
  res.json(variant);
}

export async function deleteVariant(req, res) {
  const { variantId } = req.params;
  await prisma.variant.delete({ where: { id: variantId } });
  await bumpAllBranchMenus();
  res.json({ success: true });
}

// ADD‑ON GROUPS
export async function createAddOnGroup(req, res) {
  const group = await prisma.addOnGroup.create({ data: req.body });
  await bumpAllBranchMenus();
  res.json(group);
}

export async function updateAddOnGroup(req, res) {
  const { groupId } = req.params;
  const group = await prisma.addOnGroup.update({
    where: { id: groupId },
    data: req.body
  });
  await bumpAllBranchMenus();
  res.json(group);
}

export async function deleteAddOnGroup(req, res) {
  const { groupId } = req.params;
  await prisma.addOnGroup.delete({ where: { id: groupId } });
  await bumpAllBranchMenus();
  res.json({ success: true });
}

// ADD‑ONS
export async function createAddOn(req, res) {
  const addon = await prisma.addOn.create({ data: req.body });
  await bumpAllBranchMenus();
  res.json(addon);
}

export async function updateAddOn(req, res) {
  const { addonId } = req.params;
  const addon = await prisma.addOn.update({
    where: { id: addonId },
    data: req.body
  });
  await bumpAllBranchMenus();
  res.json(addon);
}

export async function deleteAddOn(req, res) {
  const { addonId } = req.params;
  await prisma.addOn.delete({ where: { id: addonId } });
  await bumpAllBranchMenus();
  res.json({ success: true });
}
