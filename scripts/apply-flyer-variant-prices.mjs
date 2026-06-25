/**
 * Sync variant/list prices from flyer reference for all matching menu items.
 * Usage: node scripts/apply-flyer-variant-prices.mjs [branchId]
 */
import { PrismaClient } from "@prisma/client";
import { findFlyerPrice } from "./kempen-flyer-data.mjs";

const prisma = new PrismaClient();
const branches = process.argv[2] ? [process.argv[2]] : ["concordia-kempen", "concordia-straelen"];

function listPrice(flyer) {
  if (!flyer) return null;
  return flyer.single ?? flyer.klein ?? flyer.hähnchen ?? flyer.groß ?? null;
}

for (const branchId of branches) {
  const items = await prisma.branchMenuItem.findMany({
    where: { branchId },
    include: { menuItem: true }
  });

  let updated = 0;
  console.log(`\n=== ${branchId} ===`);

  for (const entry of items) {
    const flyer = findFlyerPrice(entry.menuItem.name);
    if (!flyer) continue;

    const groups = await prisma.variantGroup.findMany({
      where: { itemId: entry.menuItemId },
      include: { variants: true }
    });

    if (groups.length === 0) {
      const price = listPrice(flyer);
      if (price == null) continue;
      const current = entry.price ?? entry.menuItem.basePrice;
      if (current === price) continue;
      await prisma.menuItem.update({
        where: { id: entry.menuItemId },
        data: { basePrice: price }
      });
      await prisma.branchMenuItem.update({
        where: { id: entry.id },
        data: { price }
      });
      console.log(`FIX list #${entry.menuItem.itemNumber} ${entry.menuItem.name} → €${price}`);
      updated++;
      continue;
    }

    for (const group of groups) {
      for (const variant of group.variants) {
        const name = variant.name.toLowerCase();
        let target = null;
        if (/24|klein/.test(name) && flyer.klein != null) target = flyer.klein;
        else if (/30|groß|gross/.test(name) && flyer.groß != null) target = flyer.groß;
        else if (/hähnchen|haehnchen/.test(name) && flyer.hähnchen != null) target = flyer.hähnchen;
        else if (/schwein/.test(name) && flyer.schwein != null) target = flyer.schwein;
        else if (flyer.single != null && /standard|normal/.test(name)) target = flyer.single;

        if (target == null || Number(variant.price) === target) continue;

        await prisma.variant.update({
          where: { id: variant.id },
          data: { price: target }
        });
        console.log(
          `FIX variant #${entry.menuItem.itemNumber} ${entry.menuItem.name} ${variant.name} €${Number(variant.price).toFixed(2)} → €${target.toFixed(2)}`
        );
        updated++;
      }
    }

    const base = listPrice(flyer);
    if (base != null) {
      await prisma.menuItem.update({
        where: { id: entry.menuItemId },
        data: { basePrice: base }
      });
      await prisma.branchMenuItem.update({
        where: { id: entry.id },
        data: { price: base }
      });
    }
  }

  console.log(`Updated ${updated} price(s) for ${branchId}.`);
}

await prisma.$disconnect();
