/**
 * Fix Pizzabrötchen list prices for Kempen + Straelen from flyer reference data.
 * Usage: node scripts/fix-pizzabroetchen-prices.mjs [branchId]
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
    where: { branchId, category: { name: { contains: "Pizzabr" } } },
    include: { menuItem: true },
    orderBy: { menuItem: { itemNumber: "asc" } }
  });

  console.log(`\n=== ${branchId} ===`);
  let updated = 0;

  for (const entry of items) {
    const flyer = findFlyerPrice(entry.menuItem.name);
    const price = listPrice(flyer);
    if (price == null) {
      console.log(`SKIP #${entry.menuItem.itemNumber} ${entry.menuItem.name} (no flyer price)`);
      continue;
    }

    const current = entry.price ?? entry.menuItem.basePrice;
    if (current === price) {
      console.log(`OK   #${entry.menuItem.itemNumber} ${entry.menuItem.name} €${price.toFixed(2)}`);
      continue;
    }

    await prisma.menuItem.update({
      where: { id: entry.menuItemId },
      data: { basePrice: price }
    });
    await prisma.branchMenuItem.update({
      where: { id: entry.id },
      data: { price }
    });

    console.log(
      `FIX  #${entry.menuItem.itemNumber} ${entry.menuItem.name} €${Number(current).toFixed(2)} → €${price.toFixed(2)}`
    );
    updated++;
  }

  console.log(`Updated ${updated} item(s) for ${branchId}.`);
}

await prisma.$disconnect();
