/**
 * Configure Kempen calzones: fixed price, no size variant, pizza-style extras at groß-tier prices.
 * Usage: node scripts/apply-kempen-calzones.mjs
 */
import { PrismaClient } from "@prisma/client";
import { buildCategorizedExtras, detectItemType } from "./kempen-extras-catalog.mjs";

const BRANCH_ID = "concordia-kempen";
const CALZONE_PRICE = 10.5;
const prisma = new PrismaClient();

async function clearItemVariants(itemId) {
  await prisma.variant.deleteMany({ where: { group: { itemId } } });
  await prisma.variantGroup.deleteMany({ where: { itemId } });
}

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
    if (detectItemType(item.name) !== "calzone") continue;

    await clearItemVariants(item.id);
    await clearItemAddOns(item.id);

    await prisma.menuItem.update({
      where: { id: item.id },
      data: { basePrice: CALZONE_PRICE }
    });
    await prisma.branchMenuItem.update({
      where: { id: entry.id },
      data: { price: CALZONE_PRICE }
    });

    const extraCategories = buildCategorizedExtras(item.name);
    for (const cat of extraCategories) {
      await upsertAddOnGroup(item.id, cat.categoryId, cat.name, cat.options);
    }

    updated++;
    console.log(`Updated calzone: ${item.name} → ${CALZONE_PRICE.toFixed(2)} €, no size variant`);
  }

  console.log(`\nDone. Updated ${updated} calzone items.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
