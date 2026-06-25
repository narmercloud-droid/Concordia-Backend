/**
 * Compare DB list prices against flyer reference for a branch.
 * Usage: node scripts/audit-menu-prices.mjs [branchId]
 */
import { PrismaClient } from "@prisma/client";
import { findFlyerPrice } from "./kempen-flyer-data.mjs";

const prisma = new PrismaClient();
const branchId = process.argv[2] || "concordia-kempen";

function expectedBase(flyer) {
  if (!flyer) return null;
  return flyer.single ?? flyer.klein ?? flyer.hähnchen ?? flyer.groß ?? null;
}

const items = await prisma.branchMenuItem.findMany({
  where: { branchId },
  include: { menuItem: true, category: true },
  orderBy: [{ category: { sortOrder: "asc" } }, { menuItem: { itemNumber: "asc" } }]
});

let mismatches = 0;
let checked = 0;

for (const entry of items) {
  const flyer = findFlyerPrice(entry.menuItem.name);
  const expected = expectedBase(flyer);
  if (expected == null) continue;

  checked++;
  const current = Number(entry.price ?? entry.menuItem.basePrice ?? 0);
  const variantGroups = await prisma.variantGroup.findMany({
    where: { itemId: entry.menuItemId },
    include: { variants: true }
  });

  if (variantGroups.length > 0) {
    const klein = variantGroups
      .flatMap((g) => g.variants)
      .find((v) => /24|klein/i.test(v.name));
    const gross = variantGroups
      .flatMap((g) => g.variants)
      .find((v) => /30|groß|gross/i.test(v.name));
    const ha = variantGroups
      .flatMap((g) => g.variants)
      .find((v) => /hähnchen/i.test(v.name));
    const sch = variantGroups
      .flatMap((g) => g.variants)
      .find((v) => /schwein/i.test(v.name));

    const issues = [];
    if (flyer.klein != null && klein && Number(klein.price) !== flyer.klein) {
      issues.push(`klein ${klein.price}≠${flyer.klein}`);
    }
    if (flyer.groß != null && gross && Number(gross.price) !== flyer.groß) {
      issues.push(`groß ${gross.price}≠${flyer.groß}`);
    }
    if (flyer.hähnchen != null && ha && Number(ha.price) !== flyer.hähnchen) {
      issues.push(`Hähnchen ${ha.price}≠${flyer.hähnchen}`);
    }
    if (flyer.schwein != null && sch && Number(sch.price) !== flyer.schwein) {
      issues.push(`Schwein ${sch.price}≠${flyer.schwein}`);
    }
    if (issues.length) {
      mismatches++;
      console.log(
        `MISMATCH #${entry.menuItem.itemNumber} ${entry.menuItem.name} [${entry.category.name}] ${issues.join("; ")}`
      );
    }
    continue;
  }

  if (Math.abs(current - expected) > 0.001) {
    mismatches++;
    console.log(
      `MISMATCH #${entry.menuItem.itemNumber} ${entry.menuItem.name} [${entry.category.name}] DB €${current.toFixed(2)} ≠ flyer €${expected.toFixed(2)}`
    );
  }
}

console.log(`\n${branchId}: checked ${checked} flyer-priced items, ${mismatches} mismatch(es).`);
await prisma.$disconnect();
