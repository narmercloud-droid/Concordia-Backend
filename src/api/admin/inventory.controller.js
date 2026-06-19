import { PrismaClient } from '@prisma/client';
import { bumpAllBranchMenus, bumpBranchMenuCache } from './customerCacheBump.js';
const prisma = new PrismaClient();

// Toggle global item availability
export async function setItemAvailability(req, res) {
  const { itemId } = req.params;
  const { isAvailable } = req.body;

  const item = await prisma.menuItem.update({
    where: { id: Number(itemId) },
    data: { isAvailable }
  });

  await bumpAllBranchMenus();
  res.json(item);
}

// Branch override
export async function setBranchItemAvailability(req, res) {
  const { branchId, itemId } = req.params;
  const { isAvailable } = req.body;

  const override = await prisma.branchItemAvailability.upsert({
    where: {
      branchId_menuItemId: {
        branchId: branchId,
        menuItemId: Number(itemId)
      }
    },
    update: { isAvailable },
    create: {
      branchId: branchId,
      menuItemId: Number(itemId),
      isAvailable
    }
  });

  await bumpBranchMenuCache(branchId);
  res.json(override);
}
