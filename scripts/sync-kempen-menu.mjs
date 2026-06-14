/**
 * Sync one branch menu: flyer prices, item options (sizes/extras), promotions.
 * Each branch is independent — run per branch only (never syncs other branches).
 * Kempen: npm run sync:kempen-menu
 * Straelen: npm run sync:straelen-menu
 */
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  FLYER_PRICES,
  FLYER_PROMOTIONS,
  PASTA_NOODLE_OPTIONS,
  SALAD_DRESSING_OPTIONS,
  SCHNITZEL_MEAT_OPTIONS,
  SCHNITZEL_SALAD_SAUCE_OPTIONS
} from "./kempen-flyer-data.mjs";
import {
  buildCategorizedExtras,
  buildPizzabroetchenExtras,
  buildSchnitzelExtras,
  buildBurgerExtras,
  detectItemType,
  isPizzabroetchenItem
} from "./kempen-extras-catalog.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BRANCH_ID = process.env.SYNC_BRANCH_ID || "concordia-kempen";
const prisma = new PrismaClient();

function branchItemIdRange() {
  if (BRANCH_ID === "concordia-straelen") {
    return { gte: 20000, lt: 30000 };
  }
  return { gte: 10000, lt: 20000 };
}

async function getBranchMenuItems() {
  const entries = await prisma.branchMenuItem.findMany({
    where: { branchId: BRANCH_ID },
    include: { menuItem: true },
    orderBy: { menuItemId: "asc" }
  });

  if (entries.length > 0) {
    return entries.map((entry) => entry.menuItem);
  }

  return prisma.menuItem.findMany({
    where: { id: branchItemIdRange() },
    orderBy: { id: "asc" }
  });
}

const lieferando = JSON.parse(
  readFileSync(path.join(__dirname, "kempen-lieferando-complete.json"), "utf8")
);

function normalizeName(name) {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

function findFlyerPrice(name) {
  const n = normalizeName(name);
  for (const entry of FLYER_PRICES) {
    if (n.includes(normalizeName(entry.match))) return entry;
  }
  return null;
}

function allProducts() {
  const products = [];
  for (const cat of lieferando.categories ?? []) {
    for (const p of cat.products ?? []) products.push(p);
  }
  for (const p of lieferando.products ?? []) products.push(p);
  return products;
}

async function clearItemOptions(itemId) {
  await prisma.addOn.deleteMany({ where: { group: { itemId } } });
  await prisma.addOnGroup.deleteMany({ where: { itemId } });
  await prisma.variant.deleteMany({ where: { group: { itemId } } });
  await prisma.variantGroup.deleteMany({ where: { itemId } });
}

async function upsertSizeGroup(itemId, sizes, flyer) {
  if (
    !sizes?.length &&
    flyer?.klein == null &&
    flyer?.groß == null &&
    flyer?.single == null &&
    flyer?.hähnchen == null &&
    flyer?.schwein == null
  ) {
    return;
  }

  const groupId = `size-${BRANCH_ID}-${itemId}`;
  const groupName =
    flyer?.hähnchen != null || flyer?.schwein != null ? "Fleischwahl" : "Größe";
  await prisma.variantGroup.upsert({
    where: { id: groupId },
    update: {
      name: groupName,
      required: true,
      minSelect: 1,
      maxSelect: 1,
      includedChoice: false
    },
    create: {
      id: groupId,
      name: groupName,
      itemId,
      required: true,
      minSelect: 1,
      maxSelect: 1,
      includedChoice: false
    }
  });

  const variantEntries = [];
  if (flyer?.klein != null || flyer?.groß != null) {
    if (flyer.klein != null) {
      variantEntries.push({ id: `${groupId}-klein`, name: "klein 24 cm", price: flyer.klein });
    }
    if (flyer.groß != null) {
      variantEntries.push({ id: `${groupId}-gross`, name: "groß 30 cm", price: flyer.groß });
    }
  } else if (flyer?.hähnchen != null || flyer?.schwein != null) {
    if (flyer.hähnchen != null) {
      variantEntries.push({ id: `${groupId}-haehnchen`, name: "Hähnchen", price: flyer.hähnchen });
    }
    if (flyer.schwein != null) {
      variantEntries.push({ id: `${groupId}-schwein`, name: "Schwein", price: flyer.schwein });
    }
  } else if (sizes?.length) {
    for (const size of sizes) {
      variantEntries.push({
        id: `${groupId}-${size.externalId}`,
        name: size.name,
        price: size.priceDelivery ?? size.pricePickup ?? 0
      });
    }
  } else if (flyer?.single != null) {
    variantEntries.push({ id: `${groupId}-std`, name: "Standard", price: flyer.single });
  }

  for (const v of variantEntries) {
    await prisma.variant.upsert({
      where: { id: v.id },
      update: { name: v.name, price: v.price },
      create: { id: v.id, name: v.name, price: v.price, groupId }
    });
  }
}

async function upsertVariantChoiceGroup(
  itemId,
  suffix,
  groupName,
  options,
  required = true,
  includedChoice = false
) {
  const groupId = `choice-${BRANCH_ID}-${itemId}-${suffix}`;
  await prisma.variantGroup.upsert({
    where: { id: groupId },
    update: {
      name: groupName,
      required,
      minSelect: required ? 1 : 0,
      maxSelect: 1,
      includedChoice
    },
    create: {
      id: groupId,
      name: groupName,
      itemId,
      required,
      minSelect: required ? 1 : 0,
      maxSelect: 1,
      includedChoice
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

async function upsertAddOnGroup(itemId, suffix, groupName, options, opts = {}) {
  const { required = false, minSelect = 0, maxSelect = 99 } = opts;
  const groupId = `extra-${BRANCH_ID}-${itemId}-${suffix}`;
  await prisma.addOnGroup.upsert({
    where: { id: groupId },
    update: { name: groupName, required, minSelect, maxSelect },
    create: {
      id: groupId,
      name: groupName,
      itemId,
      required,
      minSelect,
      maxSelect
    }
  });

  for (const [i, opt] of options.entries()) {
    const extId = opt.externalId ?? String(i);
    const id = `${groupId}-${extId}`;
    await prisma.addOn.upsert({
      where: { id },
      update: { name: opt.name, price: opt.price ?? opt.priceDelivery ?? 0 },
      create: {
        id,
        name: opt.name,
        price: opt.price ?? opt.priceDelivery ?? 0,
        groupId
      }
    });
  }
}

async function applyFlyerPrices() {
  const items = await getBranchMenuItems();
  let updated = 0;

  for (const item of items) {
    const flyer = findFlyerPrice(item.name);
    if (!flyer) continue;

    const base =
      flyer.klein ?? flyer.single ?? flyer.hähnchen ?? flyer.groß ?? item.basePrice;
    if (base != null && base !== item.basePrice) {
      await prisma.menuItem.update({
        where: { id: item.id },
        data: { basePrice: base }
      });
      updated++;
    }

    const branchItem = await prisma.branchMenuItem.findFirst({
      where: { branchId: BRANCH_ID, menuItemId: item.id }
    });
    if (branchItem && base != null) {
      await prisma.branchMenuItem.update({
        where: { id: branchItem.id },
        data: { price: base }
      });
    }
  }

  console.log(`Flyer prices applied to ${updated} items`);
}

async function syncOptionsFromLieferando() {
  const products = allProducts();
  const productByName = new Map();
  for (const p of products) {
    productByName.set(normalizeName(p.name), p);
  }

  const items = await getBranchMenuItems();
  let synced = 0;

  for (const item of items) {
    const itemType = detectItemType(item.name);
    if (itemType === "drinks") continue;

    const product = productByName.get(normalizeName(item.name));
    const flyer = findFlyerPrice(item.name);
    const name = normalizeName(item.name);

    const isBurger = itemType === "burger";
    const isCalzone = itemType === "calzone";
    const isPasta = name.startsWith("pasta ") || name.includes("auflauf");
    const isSalad = name.startsWith("salat ");
    const isSchnitzel = name.includes("schnitzel");

    await clearItemOptions(item.id);

    const useFlyerSingleOnly =
      flyer?.single != null &&
      flyer.klein == null &&
      flyer.groß == null &&
      flyer.hähnchen == null;
    const lieferandoSizes =
      product?.sizes?.length === 1 &&
      normalizeName(product.sizes[0].name) === name
        ? []
        : product?.sizes ?? [];

    // Calzones: fixed flyer price, no size choice
    if (!isCalzone) {
      await upsertSizeGroup(
        item.id,
        useFlyerSingleOnly ? [] : lieferandoSizes,
        useFlyerSingleOnly ? { ...flyer, single: undefined } : flyer
      );
    }

    // Required choice groups from lieferando (skip meat deltas when flyer has absolute meat prices)
    for (const [idx, group] of (product?.requiredGroups ?? []).entries()) {
      if (!group.options?.length) continue;
      if (isSalad) continue; // dressing handled as free included choice below
      if (isSchnitzel && (flyer?.hähnchen != null || flyer?.schwein != null)) continue;
      const groupName =
        group.name ??
        (isPasta || group.options[0]?.name?.includes("Spaghetti")
          ? "Nudelsorte"
          : "Wählen Sie");
      await upsertVariantChoiceGroup(
        item.id,
        `req-${idx}`,
        groupName,
        group.options.map((o) => ({
          name: o.name.replace(/^mit\s+/i, ""),
          price: o.priceDelivery ?? 0,
          externalId: o.externalId
        })),
        group.required !== false
      );
    }

    // Category-specific options when lieferando data is thin
    if (isPasta && !(product?.requiredGroups?.length)) {
      await upsertVariantChoiceGroup(
        item.id,
        "noodle",
        "Nudelsorte",
        PASTA_NOODLE_OPTIONS,
        true,
        true
      );
    }

    if (isSalad) {
      await upsertVariantChoiceGroup(
        item.id,
        "dressing",
        "Dressing",
        SALAD_DRESSING_OPTIONS,
        true,
        true
      );
    }

    if (isSchnitzel && flyer?.hähnchen == null && flyer?.schwein == null) {
      await upsertVariantChoiceGroup(
        item.id,
        "meat",
        "Fleischwahl",
        SCHNITZEL_MEAT_OPTIONS,
        true,
        false
      );
    }

    if (isSchnitzel) {
      await upsertVariantChoiceGroup(
        item.id,
        "salat-sauce",
        "Salatsoße",
        SCHNITZEL_SALAD_SAUCE_OPTIONS,
        true,
        true
      );
    }

    // Categorized extras — every food item gets relevant groups (not identical lists)
    const extraCategories = isPizzabroetchenItem(item.name, item.itemNumber)
      ? buildPizzabroetchenExtras(item.name, item.itemNumber)
      : isSchnitzel
        ? buildSchnitzelExtras()
        : isBurger
          ? buildBurgerExtras()
          : buildCategorizedExtras(item.name);
    for (const cat of extraCategories) {
      await upsertAddOnGroup(item.id, cat.categoryId, cat.name, cat.options);
    }

    synced++;
  }

  console.log(`Options synced for ${synced} items`);
}

async function applyPromotions() {
  const config = await prisma.branchConfig.findUnique({
    where: { branchId: BRANCH_ID }
  });

  const existing = (config?.configJson ?? {}) ;
  const configJson = {
    ...existing,
    promotions: FLYER_PROMOTIONS
  };

  await prisma.branchConfig.upsert({
    where: { branchId: BRANCH_ID },
    update: { configJson },
    create: { id: `config-${BRANCH_ID}`, branchId: BRANCH_ID, configJson }
  });

  console.log("Promotions applied:", FLYER_PROMOTIONS);
}

async function applyDeliverySettings() {
  const deliveryAreas = (lieferando.deliveryAreas ?? []).map((area) => ({
    postalCode: String(area.postalCode ?? area.deliveryAreaId ?? ""),
    city: area.city ?? "Kempen",
    minimumOrder: Number(area.minimumOrder ?? 15),
    deliveryFee: Number(area.deliveryFee ?? 2)
  }));

  const config = await prisma.branchConfig.findUnique({
    where: { branchId: BRANCH_ID }
  });
  const existing = (config?.configJson ?? {});

  const configJson = {
    ...existing,
    deliveryMode: "both",
    freeDeliveryAtMinimum: true,
    deliveryAreas,
    deliveryRadiusZones: [
      { maxDistanceKm: 5, minimumOrder: 15, deliveryFee: 2, label: "0–5 km" },
      { maxDistanceKm: 10, minimumOrder: 20, deliveryFee: 3, label: "5–10 km" },
      { maxDistanceKm: 15, minimumOrder: 30, deliveryFee: 4, label: "10–15 km" }
    ],
    address: existing.address ?? "Concordienplatz 1",
    city: existing.city ?? "Kempen",
    postalCode: existing.postalCode ?? "47906",
    lat: existing.lat ?? 51.364,
    lng: existing.lng ?? 6.418
  };

  await prisma.branchConfig.upsert({
    where: { branchId: BRANCH_ID },
    update: { configJson },
    create: { id: `config-${BRANCH_ID}`, branchId: BRANCH_ID, configJson }
  });

  console.log(`Delivery settings applied (${deliveryAreas.length} postcodes, mode: both)`);
}

async function main() {
  await applyFlyerPrices();
  await syncOptionsFromLieferando();
  await applyPromotions();
  await applyDeliverySettings();
  console.log(`Menu sync complete for ${BRANCH_ID}.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
