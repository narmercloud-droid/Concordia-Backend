import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getCustomerMenu(branchId) {
  const categories = await prisma.category.findMany({
    where: { branchId, isAvailable: true },
    orderBy: { sortOrder: 'asc' },
    include: {
      menuItems: {
        where: { isAvailable: true },
        include: {
          variantGroups: {
            include: { variants: true }
          },
          addOnGroups: {
            include: { addOns: true }
          }
        }
      }
    }
  });

  const overrides = await prisma.branchItemAvailability.findMany({
    where: { branchId }
  });

  const overrideMap = {};
  for (const o of overrides) {
    overrideMap[o.menuItemId] = o.isAvailable;
  }

  for (const category of categories) {
    for (const item of category.menuItems) {
      if (overrideMap[item.id] !== undefined) {
        item.isAvailable = overrideMap[item.id];
      }
    }
  }

  const pricingOverrides = await prisma.branchItemPricing.findMany({
    where: { branchId }
  });

  const pricingMap = {};
  for (const p of pricingOverrides) {
    pricingMap[p.menuItemId] = p.price;
  }

  for (const category of categories) {
    for (const item of category.menuItems) {
      if (pricingMap[item.id] !== undefined && pricingMap[item.id] !== null) {
        item.basePrice = pricingMap[item.id];
      }
    }
  }

  return categories;
}
