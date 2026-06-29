/**
 * Apply Kempen-style extras to Straelen menu items (same rules as apply-kempen-* scripts).
 * Does not change branch status, prices, or size variants.
 *
 * Run: node scripts/copy-straelen-extras-from-kempen.mjs
 */
import { PrismaClient } from "@prisma/client";
import { SCHNITZEL_SALAD_SAUCE_OPTIONS } from "./kempen-flyer-data.mjs";
import {
  buildBurgerExtras,
  buildCategorizedExtras,
  buildPizzabroetchenExtras,
  buildSchnitzelExtras,
  detectItemType,
  isPizzabroetchenItem,
  KRAEUTERBUTTER_PORTION_EXTRA
} from "./kempen-extras-catalog.mjs";

const prisma = new PrismaClient();
const BRANCH_ID = "concordia-straelen";

/** Items with custom options — see configure-straelen-*-extras.mjs */
const CUSTOM_ITEM_NUMBERS = new Set([
  "80",
  "81",
  "82",
  "83",
  "84",
  "87",
  "89",
  "90",
  "94",
  "160",
  "161",
  "162",
  "163",
  "164"
]);

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

function resolvePizzabroetchenExtras(item) {
  const name = item.name.trim();
  const lower = name.toLowerCase();

  if (lower === "portion kräuterbutter") return [];

  if (
    lower.includes("pizzabrötchen") &&
    (lower.includes("10 stück") || lower.includes("10 stuck")) &&
    !lower.includes("mit ")
  ) {
    return [{ ...KRAEUTERBUTTER_PORTION_EXTRA, options: [...KRAEUTERBUTTER_PORTION_EXTRA.options] }];
  }

  if (isPizzabroetchenItem(item.name, item.itemNumber)) {
    return buildPizzabroetchenExtras(item.name, item.itemNumber);
  }

  if (lower.includes("pizzabrötchen") && lower.includes("mit ")) {
    return buildPizzabroetchenExtras("Gefüllte Pizzabrötchen", "46");
  }

  return null;
}

function resolveExtraCategories(item) {
  const type = detectItemType(item.name);

  if (type === "drinks") return [];

  const broetchen = resolvePizzabroetchenExtras(item);
  if (broetchen !== null) return broetchen;

  if (type === "burger") return buildBurgerExtras();
  if (type === "pizza" || type === "calzone" || type === "pizza-large") {
    return buildCategorizedExtras(item.name);
  }

  return buildCategorizedExtras(item.name);
}

async function main() {
  const config = await prisma.branchConfig.findUnique({
    where: { branchId: BRANCH_ID }
  });
  const status = config?.configJson?.status ?? "unknown";
  console.log(`Straelen status: ${status} (will not change)\n`);

  const entries = await prisma.branchMenuItem.findMany({
    where: { branchId: BRANCH_ID },
    include: { menuItem: true, category: true },
    orderBy: { menuItemId: "asc" }
  });

  let updated = 0;
  let skipped = 0;

  for (const entry of entries) {
    const item = entry.menuItem;
    const categoryName = entry.category?.name?.toLowerCase() ?? "";
    const isDrink =
      categoryName.includes("getränk") ||
      detectItemType(item.name) === "drinks" ||
      item.name.toLowerCase().includes("ayran");

    if (isDrink) {
      await clearItemAddOns(item.id);
      skipped++;
      continue;
    }

    if (CUSTOM_ITEM_NUMBERS.has(String(item.itemNumber ?? ""))) {
      skipped++;
      continue;
    }

    const type = detectItemType(item.name);
    const extraCategories = resolveExtraCategories(item);

    if (!extraCategories.length && type !== "schnitzel") {
      await clearItemAddOns(item.id);
      skipped++;
      continue;
    }

    await clearItemAddOns(item.id);

    if (type === "schnitzel") {
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
      console.log(`  ✓ #${item.itemNumber ?? "?"} ${item.name} (schnitzel)`);
      continue;
    }

    for (const cat of extraCategories) {
      await upsertAddOnGroup(item.id, cat.categoryId, cat.name, cat.options);
    }

    if (extraCategories.length) {
      updated++;
      const summary = extraCategories.map((c) => c.name).join(", ");
      console.log(`  ✓ #${item.itemNumber ?? "?"} ${item.name} → ${summary}`);
    } else {
      skipped++;
    }
  }

  const menuItemIds = entries.map((e) => e.menuItemId);
  const [groups, addOns] = await Promise.all([
    prisma.addOnGroup.count({ where: { itemId: { in: menuItemIds } } }),
    prisma.addOn.count({ where: { group: { itemId: { in: menuItemIds } } } })
  ]);

  console.log("\n--- Summary ---");
  console.log(`Updated: ${updated} items`);
  console.log(`No extras: ${skipped} items`);
  console.log(`Straelen totals: ${groups} groups, ${addOns} add-ons`);
  console.log(`Straelen status still: ${status}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
