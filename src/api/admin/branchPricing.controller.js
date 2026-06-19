import { PrismaClient } from '@prisma/client';
import { bumpBranchMenuCache } from './customerCacheBump.js';
const prisma = new PrismaClient();

export async function setBranchItemPrice(req, res) {
  const { branchId, itemId } = req.params;
  const { price } = req.body;

  const override = await prisma.branchItemPricing.upsert({
    where: {
      branchId_menuItemId: {
        branchId: branchId,
        menuItemId: Number(itemId)
      }
    },
    update: { price },
    create: {
      branchId: branchId,
      menuItemId: Number(itemId),
      price
    }
  });

  await bumpBranchMenuCache(branchId);
  res.json(override);
}

export async function clearBranchItemPrice(req, res) {
  const { branchId, itemId } = req.params;

  await prisma.branchItemPricing.delete({
    where: {
      branchId_menuItemId: {
        branchId: branchId,
        menuItemId: Number(itemId)
      }
    }
  });

  await bumpBranchMenuCache(branchId);
  res.json({ success: true });
}
