/**
 * Import Straelen menu from printed menu photos (straelen-menu-data.mjs).
 * Branch stays coming_soon — menu is visible but ordering remains disabled on the website.
 *
 * Run: npm run import:straelen-menu
 */
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import {
  STRAELEN_BRANCH,
  STRAELEN_CATEGORIES,
  STRAELEN_PRODUCTS,
  STRAELEN_MENU_STATS
} from "./straelen-menu-data.mjs";
import { numberSortKey } from "./kempen-menu-numbers.mjs";

const prisma = new PrismaClient();
const BRANCH_ID = STRAELEN_BRANCH.id;
const ITEM_ID_START = 20000;

async function clearBranchMenu(branchId) {
  const existingItems = await prisma.branchMenuItem.findMany({
    where: { branchId },
    select: { menuItemId: true }
  });
  const menuItemIds = existingItems.map((entry) => entry.menuItemId);

  await prisma.branchMenuItem.deleteMany({ where: { branchId } });
  await prisma.branchCategory.deleteMany({ where: { branchId } });
  await prisma.branchItemPricing.deleteMany({ where: { branchId } });

  if (!menuItemIds.length) return;

  await prisma.addOn.deleteMany({
    where: { group: { itemId: { in: menuItemIds } } }
  });
  await prisma.addOnGroup.deleteMany({
    where: { itemId: { in: menuItemIds } }
  });
  await prisma.variant.deleteMany({
    where: { group: { itemId: { in: menuItemIds } } }
  });
  await prisma.variantGroup.deleteMany({
    where: { itemId: { in: menuItemIds } }
  });
  await prisma.menuItem.deleteMany({
    where: { id: { in: menuItemIds } }
  });
}

async function upsertStraelenBranch() {
  const kempenConfig = await prisma.branchConfig.findUnique({
    where: { branchId: "concordia-kempen" }
  });
  const kempen = (kempenConfig?.configJson ?? {});

  await prisma.branch.upsert({
    where: { id: BRANCH_ID },
    update: { name: STRAELEN_BRANCH.name },
    create: {
      id: BRANCH_ID,
      name: STRAELEN_BRANCH.name,
      printerType: "sunmi",
      printerUrl: null,
      avgPrepTimeBaseline: 20,
      currentLoadLevel: 0
    }
  });

  const configJson = {
    ...kempen,
    slug: "straelen",
    status: STRAELEN_BRANCH.status,
    city: STRAELEN_BRANCH.city,
    address: STRAELEN_BRANCH.address,
    postalCode: STRAELEN_BRANCH.postalCode,
    lat: STRAELEN_BRANCH.lat,
    lng: STRAELEN_BRANCH.lng,
    terminalCode: STRAELEN_BRANCH.terminalCode,
    websiteUrl: STRAELEN_BRANCH.websiteUrl,
    lieferandoUrl: STRAELEN_BRANCH.lieferandoUrl,
    supportsPickup: true,
    supportsDelivery: true,
    promotions: kempen.promotions ?? {
      freeDrinkMinOrder: 35,
      freeDrinkMessage:
        "Ab 35 € Bestellwert erhalten Sie ein Getränk gratis (0,33 l Softdrink oder 0,5 l Durstlöscher)."
    }
  };

  await prisma.branchConfig.upsert({
    where: { branchId: BRANCH_ID },
    update: { configJson },
    create: {
      id: `config-${BRANCH_ID}`,
      branchId: BRANCH_ID,
      configJson
    }
  });
}

async function copyOpeningHours() {
  const hours = await prisma.branchHours.findMany({
    where: { branchId: "concordia-kempen" }
  });

  if (!hours.length) {
    console.log("  (no Kempen hours to copy — skip)");
    return;
  }

  for (const entry of hours) {
    await prisma.branchHours.upsert({
      where: {
        branchId_dayOfWeek: { branchId: BRANCH_ID, dayOfWeek: entry.dayOfWeek }
      },
      update: {
        openTime: entry.openTime,
        closeTime: entry.closeTime
      },
      create: {
        id: randomUUID(),
        branchId: BRANCH_ID,
        dayOfWeek: entry.dayOfWeek,
        openTime: entry.openTime,
        closeTime: entry.closeTime
      }
    });
  }

  console.log(`  ✓ ${hours.length} opening-hour rows`);
}

async function importProducts() {
  await clearBranchMenu(BRANCH_ID);

  const categoryMap = new Map();

  for (const category of STRAELEN_CATEGORIES) {
    const row = await prisma.branchCategory.create({
      data: {
        branchId: BRANCH_ID,
        name: category.name,
        description: category.description || null,
        sortOrder: category.sortOrder
      }
    });
    categoryMap.set(category.name, row.id);
  }

  let itemCounter = ITEM_ID_START;
  let imported = 0;

  for (const product of STRAELEN_PRODUCTS) {
    const categoryId = categoryMap.get(product.categoryName);
    if (!categoryId) {
      console.warn(`  skip (unknown category): ${product.name}`);
      continue;
    }

    const menuItemId = itemCounter++;
    const sortOrder = numberSortKey(product.itemNumber);

    await prisma.menuItem.create({
      data: {
        id: menuItemId,
        name: product.name,
        description: product.description,
        basePrice: product.priceDelivery,
        isAvailable: true,
        kitchen: product.kitchen,
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

    if (product.sizes.length > 0) {
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

    for (const [index, group] of product.extraGroups.entries()) {
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

    imported++;
  }

  return imported;
}

async function seedStraelenManager() {
  const defaultPassword = process.env.SEED_ADMIN_PASSWORD || "Kempen2026!";
  const hash = await bcrypt.hash(defaultPassword, 10);

  await prisma.admin.upsert({
    where: { email: "straelen@concordia.de" },
    update: {
      password: hash,
      name: "Straelen Manager",
      role: "manager",
      branchId: BRANCH_ID
    },
    create: {
      id: "admin-straelen",
      email: "straelen@concordia.de",
      password: hash,
      name: "Straelen Manager",
      role: "manager",
      branchId: BRANCH_ID
    }
  });
}

async function main() {
  console.log("Importing Straelen menu (coming_soon — ordering not activated)...");
  console.log(
    `  Source: ${STRAELEN_MENU_STATS.categories} categories, ${STRAELEN_MENU_STATS.products} items`
  );

  await upsertStraelenBranch();
  console.log("  ✓ Branch config (status: coming_soon)");

  await copyOpeningHours();
  const count = await importProducts();
  await seedStraelenManager();

  console.log(`  ✓ Imported ${count} menu items (IDs ${ITEM_ID_START}+)`);
  console.log("  ✓ Manager: straelen@concordia.de");
  console.log(`Preview path: /branch/${BRANCH_ID}`);
  console.log("Done.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
