/**
 * Apply Straelen menu changes without deleting items referenced by orders.
 * Updates prices/names from straelen-menu-data.mjs and adds new items.
 *
 * Run: node scripts/update-straelen-menu.mjs
 */
import { PrismaClient } from "@prisma/client";
import {
  STRAELEN_PRODUCTS,
  STRAELEN_CATEGORIES
} from "./straelen-menu-data.mjs";
import { numberSortKey } from "./kempen-menu-numbers.mjs";

const prisma = new PrismaClient();
const BRANCH_ID = "concordia-straelen";
const ITEM_ID_START = 20000;
const ITEM_ID_END = 30000;

const expectedItemNumbers = new Set(STRAELEN_PRODUCTS.map((p) => p.itemNumber));

async function getCategoryMap() {
  const rows = await prisma.branchCategory.findMany({
    where: { branchId: BRANCH_ID }
  });
  const map = new Map(rows.map((r) => [r.name, r.id]));

  for (const cat of STRAELEN_CATEGORIES) {
    if (map.has(cat.name)) continue;
    const row = await prisma.branchCategory.create({
      data: {
        branchId: BRANCH_ID,
        name: cat.name,
        description: cat.description || null,
        sortOrder: cat.sortOrder
      }
    });
    map.set(cat.name, row.id);
  }

  return map;
}

async function nextMenuItemId() {
  const max = await prisma.menuItem.aggregate({
    where: { id: { gte: ITEM_ID_START, lt: ITEM_ID_END } },
    _max: { id: true }
  });
  return (max._max.id ?? ITEM_ID_START - 1) + 1;
}

async function clearItemOptions(itemId) {
  await prisma.addOn.deleteMany({ where: { group: { itemId } } });
  await prisma.addOnGroup.deleteMany({ where: { itemId } });
  await prisma.variant.deleteMany({ where: { group: { itemId } } });
  await prisma.variantGroup.deleteMany({ where: { itemId } });
}

async function applyProductOptions(menuItemId, product) {
  await clearItemOptions(menuItemId);

  if (product.sizes?.length > 0) {
    const groupId = `size-${BRANCH_ID}-${menuItemId}`;
    await prisma.variantGroup.create({
      data: {
        id: groupId,
        name: "Größe",
        itemId: menuItemId,
        required: true,
        minSelect: 1,
        maxSelect: 1
      }
    });

    for (const size of product.sizes) {
      await prisma.variant.create({
        data: {
          id: `${groupId}-${size.externalId}`,
          name: size.name,
          price: size.priceDelivery,
          groupId
        }
      });
    }
  }

  for (const [index, group] of (product.extraGroups ?? []).entries()) {
    const groupId = `extra-${BRANCH_ID}-${menuItemId}-${index}`;
    await prisma.addOnGroup.create({
      data: {
        id: groupId,
        name: group.name ?? "Extras",
        itemId: menuItemId,
        required: group.required ?? false,
        minSelect: group.min ?? 0,
        maxSelect: group.max ?? 99
      }
    });

    for (const option of group.options ?? []) {
      await prisma.addOn.create({
        data: {
          id: `${groupId}-${option.externalId}`,
          name: option.name,
          price: option.priceDelivery,
          groupId
        }
      });
    }
  }

  for (const [index, group] of (product.requiredGroups ?? []).entries()) {
    const groupId = `choice-${BRANCH_ID}-${menuItemId}-${index}`;
    await prisma.variantGroup.create({
      data: {
        id: groupId,
        name: group.name ?? "Wählen Sie",
        itemId: menuItemId,
        required: group.required !== false,
        minSelect: 1,
        maxSelect: 1
      }
    });

    for (const [optIndex, option] of (group.options ?? []).entries()) {
      await prisma.variant.create({
        data: {
          id: `${groupId}-${option.externalId ?? optIndex}`,
          name: option.name.replace(/^mit\s+/i, ""),
          price: option.priceDelivery ?? 0,
          groupId
        }
      });
    }
  }
}

async function upsertProduct(product, categoryMap) {
  const categoryId = categoryMap.get(product.categoryName);
  if (!categoryId) {
    console.warn(`  skip unknown category: ${product.name}`);
    return "skipped";
  }

  const sortOrder = numberSortKey(product.itemNumber);
  const isPizza =
    product.categoryName === "Pizzen" ||
    product.categoryName === "Calzone" ||
    product.name.toLowerCase().includes("pizza") ||
    product.name.toLowerCase().includes("calzone");
  const kitchen = product.kitchen ?? (isPizza ? "A" : "B");

  const branchEntry = await prisma.branchMenuItem.findFirst({
    where: {
      branchId: BRANCH_ID,
      menuItem: { itemNumber: product.itemNumber }
    },
    include: { menuItem: true }
  });

  if (branchEntry) {
    await prisma.menuItem.update({
      where: { id: branchEntry.menuItemId },
      data: {
        name: product.name,
        description: product.description,
        basePrice: product.priceDelivery,
        isAvailable: true,
        kitchen,
        sortOrder
      }
    });

    await prisma.branchMenuItem.update({
      where: { id: branchEntry.id },
      data: {
        price: product.priceDelivery,
        description: product.description,
        isAvailable: true,
        categoryId
      }
    });

    await applyProductOptions(branchEntry.menuItemId, product);
    return "updated";
  }

  const menuItemId = await nextMenuItemId();
  await prisma.menuItem.create({
    data: {
      id: menuItemId,
      name: product.name,
      description: product.description,
      basePrice: product.priceDelivery,
      isAvailable: true,
      kitchen,
      itemNumber: product.itemNumber,
      sortOrder
    }
  });

  await prisma.branchMenuItem.create({
    data: {
      branchId: BRANCH_ID,
      menuItemId,
      price: product.priceDelivery,
      description: product.description,
      isAvailable: true,
      categoryId
    }
  });

  await applyProductOptions(menuItemId, product);
  return "created";
}

async function retireObsoleteItems() {
  const branchItems = await prisma.branchMenuItem.findMany({
    where: { branchId: BRANCH_ID },
    include: { menuItem: true, category: true }
  });

  let retired = 0;
  for (const entry of branchItems) {
    const num = entry.menuItem.itemNumber;
    if (!num || expectedItemNumbers.has(num)) continue;

    await prisma.branchMenuItem.update({
      where: { id: entry.id },
      data: { isAvailable: false }
    });
    await prisma.menuItem.update({
      where: { id: entry.menuItemId },
      data: { isAvailable: false }
    });
    retired++;
    console.log(`  retired #${num} ${entry.menuItem.name}`);
  }

  return retired;
}

async function main() {
  console.log(`Updating ${BRANCH_ID} menu (${STRAELEN_PRODUCTS.length} reference items)...`);

  const categoryMap = await getCategoryMap();
  let created = 0;
  let updated = 0;

  for (const product of STRAELEN_PRODUCTS) {
    const result = await upsertProduct(product, categoryMap);
    if (result === "created") created++;
    if (result === "updated") updated++;
  }

  const retired = await retireObsoleteItems();

  console.log(`Done: ${updated} updated, ${created} created, ${retired} retired.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
