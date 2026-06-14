/**
 * Apply pizza extra groups for Kempen (Pizzen category items only).
 * Usage: node scripts/apply-kempen-pizza-extras.mjs
 */
import { PrismaClient } from "@prisma/client";
import { buildCategorizedExtras, detectItemType } from "./kempen-extras-catalog.mjs";

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
    orderBy: { menuItemId: "asc" }
  });

  let updated = 0;
  for (const entry of entries) {
    const item = entry.menuItem;
    const type = detectItemType(item.name);
    if (type !== "pizza") continue; // excludes calzone — see apply-kempen-calzones.mjs

    await clearItemAddOns(item.id);
    const extraCategories = buildCategorizedExtras(item.name);
    for (const cat of extraCategories) {
      await upsertAddOnGroup(item.id, cat.categoryId, cat.name, cat.options);
    }
    updated++;
    console.log(`Updated extras: ${item.name}`);
  }

  console.log(`\nDone. Updated ${updated} pizza items.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
