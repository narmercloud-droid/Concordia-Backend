/**
 * Apply burger extras for Kempen.
 * Usage: node scripts/apply-kempen-burger-extras.mjs
 */
import { PrismaClient } from "@prisma/client";
import { buildBurgerExtras, detectItemType } from "./kempen-extras-catalog.mjs";

const BRANCH_ID = "concordia-kempen";
const prisma = new PrismaClient();

async function clearItemAddOns(itemId) {
  await prisma.addOn.deleteMany({ where: { group: { itemId } } });
  await prisma.addOnGroup.deleteMany({ where: { itemId } });
}

async function upsertAddOnGroup(itemId, suffix, groupName, options) {
  const groupId = `extra-${BRANCH_ID}-${itemId}-${suffix}`;
  await prisma.addOnGroup.upsert({
    where: { id: groupId },
    update: { name: groupName, required: false, minSelect: 0, maxSelect: 99 },
    create: {
      id: groupId,
      name: groupName,
      itemId,
      required: false,
      minSelect: 0,
      maxSelect: 99
    }
  });

  for (const [i, opt] of options.entries()) {
    const id = `${groupId}-${i}`;
    await prisma.addOn.upsert({
      where: { id },
      update: { name: opt.name, price: opt.price ?? 0 },
      create: { id, name: opt.name, price: opt.price ?? 0, groupId }
    });
  }
}

async function main() {
  const entries = await prisma.branchMenuItem.findMany({
    where: { branchId: BRANCH_ID },
    include: { menuItem: true },
    orderBy: { menuItem: { itemNumber: "asc" } }
  });

  let updated = 0;
  for (const entry of entries) {
    const item = entry.menuItem;
    if (detectItemType(item.name) !== "burger") continue;

    await clearItemAddOns(item.id);
    for (const cat of buildBurgerExtras()) {
      await upsertAddOnGroup(item.id, cat.categoryId, cat.name, cat.options);
    }

    updated++;
    console.log(`Updated: #${item.itemNumber ?? "?"} ${item.name}`);
  }

  console.log(`\nDone. Updated ${updated} burger items.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
