/**
 * Apply Pizzabrötchen extras for Kempen.
 * #45: Kräuterbutter Portion only · #45a: none · #46–54: butter + pizza-style extras
 * Usage: node scripts/apply-kempen-pizzabroetchen-extras.mjs
 */
import { PrismaClient } from "@prisma/client";
import {
  buildPizzabroetchenExtras,
  isPizzabroetchenItem
} from "./kempen-extras-catalog.mjs";

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
    where: {
      branchId: BRANCH_ID,
      category: { name: { contains: "Pizzabr" } }
    },
    include: { menuItem: true },
    orderBy: { menuItem: { itemNumber: "asc" } }
  });

  let updated = 0;
  for (const entry of entries) {
    const item = entry.menuItem;
    if (!isPizzabroetchenItem(item.name, item.itemNumber)) continue;

    await clearItemAddOns(item.id);
    const extraCategories = buildPizzabroetchenExtras(item.name, item.itemNumber);

    for (const cat of extraCategories) {
      await upsertAddOnGroup(item.id, cat.categoryId, cat.name, cat.options);
    }

    updated++;
    const summary =
      extraCategories.length === 0
        ? "no extras"
        : extraCategories
            .map((c) => `${c.name} (${c.options.length})`)
            .join(", ");
    console.log(`#${item.itemNumber ?? "?"} ${item.name} → ${summary}`);
  }

  console.log(`\nDone. Updated ${updated} Pizzabrötchen items.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
