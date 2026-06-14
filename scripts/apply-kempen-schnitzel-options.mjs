/**
 * Apply schnitzel options for Kempen:
 * - Free required Salatsoße choice (Beilagensalat)
 * - Paid extras: Mayonnaise, Ketchup (1 € each)
 * Keeps existing Fleischwahl variant.
 * Usage: node scripts/apply-kempen-schnitzel-options.mjs
 */
import { PrismaClient } from "@prisma/client";
import { SCHNITZEL_SALAD_SAUCE_OPTIONS } from "./kempen-flyer-data.mjs";
import { buildSchnitzelExtras, detectItemType } from "./kempen-extras-catalog.mjs";

const BRANCH_ID = "concordia-kempen";
const prisma = new PrismaClient();

async function clearItemAddOns(itemId) {
  await prisma.addOn.deleteMany({ where: { group: { itemId } } });
  await prisma.addOnGroup.deleteMany({ where: { itemId } });
}

async function upsertVariantChoiceGroup(itemId, suffix, groupName, options) {
  const groupId = `choice-${BRANCH_ID}-${itemId}-${suffix}`;
  await prisma.variantGroup.upsert({
    where: { id: groupId },
    update: {
      name: groupName,
      required: true,
      minSelect: 1,
      maxSelect: 1,
      includedChoice: true
    },
    create: {
      id: groupId,
      name: groupName,
      itemId,
      required: true,
      minSelect: 1,
      maxSelect: 1,
      includedChoice: true
    }
  });

  for (const [i, opt] of options.entries()) {
    const id = `${groupId}-${i}`;
    await prisma.variant.upsert({
      where: { id },
      update: { name: opt.name, price: opt.price },
      create: { id, name: opt.name, price: opt.price, groupId }
    });
  }
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
    if (detectItemType(item.name) !== "schnitzel") continue;

    await clearItemAddOns(item.id);
    await upsertVariantChoiceGroup(
      item.id,
      "salat-sauce",
      "Salatsoße",
      SCHNITZEL_SALAD_SAUCE_OPTIONS
    );

    for (const cat of buildSchnitzelExtras()) {
      await upsertAddOnGroup(item.id, cat.categoryId, cat.name, cat.options);
    }

    updated++;
    console.log(`Updated: #${item.itemNumber ?? "?"} ${item.name}`);
  }

  console.log(`\nDone. Updated ${updated} schnitzel items.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
