import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { requireSeedPassword } from "./lib/require-seed-password.mjs";

const prisma = new PrismaClient();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const COMPLETE_PATH = path.join(__dirname, "kempen-lieferando-complete.json");

const BRANCHES = [
  {
    id: "concordia-kempen",
    name: "Concordia Kempen",
    status: "live",
    city: "Kempen",
    address: "Concordienplatz 1",
    postalCode: "47906",
    lat: 51.3703503,
    lng: 6.4105939,
    lieferandoUrl: "https://www.lieferando.de/speisekarte/pizzeria-concordia-concordienplatz",
    websiteUrl: "https://www.pizzeria-concordia-kempen.de/",
    googlePlaceId: null
  },
  {
    id: "concordia-straelen",
    name: "Concordia Straelen",
    status: "coming_soon",
    city: "Straelen",
    address: "Venloer Straße 22",
    postalCode: "47638",
    lat: 51.4412,
    lng: 6.2684,
    lieferandoUrl: "https://www.lieferando.de/speisekarte/pizzeria-concordia-ll",
    websiteUrl: "https://www.pizzaconcordiall-straelen.de/"
  }
];

function loadMenuData() {
  if (!fs.existsSync(COMPLETE_PATH)) {
    throw new Error(
      `Missing ${COMPLETE_PATH}. Run: npm run extract:lieferando`
    );
  }
  return JSON.parse(fs.readFileSync(COMPLETE_PATH, "utf8"));
}

async function upsertBranch(branch, menuData) {
  const kempenExtras =
    branch.id === "concordia-kempen"
      ? {
          lieferandoRestaurantId: menuData.source.restaurantId,
          terminalCode: "KEMPEN",
          deliveryMode: "postcodes",
          freeDeliveryAtMinimum: true,
          deliveryAreas: (menuData.deliveryAreas ?? []).map((area) => ({
            ...area,
            postalCode: String(area.postalCode ?? area.deliveryAreaId ?? "")
          })),
          deliveryRadiusZones: [
            { maxDistanceKm: 5, minimumOrder: 15, deliveryFee: 2, label: "0–5 km" },
            { maxDistanceKm: 10, minimumOrder: 20, deliveryFee: 3, label: "5–10 km" },
            { maxDistanceKm: 15, minimumOrder: 30, deliveryFee: 4, label: "10–15 km" }
          ],
          openingHours: menuData.openingHours,
          promotions: {
            freeDrinkMinOrder: 35,
            freeDrinkMessage:
              "Ab 35 € Bestellwert erhalten Sie ein Getränk gratis (0,33 l Softdrink oder 0,5 l Durstlöscher)."
          }
        }
      : branch.id.startsWith("concordia-")
        ? { terminalCode: branch.id.replace("concordia-", "").toUpperCase() }
        : {};

  const configJson = {
    slug: branch.id.replace("concordia-", ""),
    status: branch.status,
    city: branch.city,
    address: branch.address ?? null,
    postalCode: branch.postalCode ?? null,
    lat: branch.lat ?? null,
    lng: branch.lng ?? null,
    lieferandoUrl: branch.lieferandoUrl ?? null,
    websiteUrl: branch.websiteUrl ?? null,
    googlePlaceId: branch.googlePlaceId ?? null,
    supportsPickup: true,
    supportsDelivery: true,
    ...kempenExtras
  };

  await prisma.branch.upsert({
    where: { id: branch.id },
    update: { name: branch.name },
    create: {
      id: branch.id,
      name: branch.name,
      printerType: "sunmi",
      printerUrl: null,
      avgPrepTimeBaseline: 20,
      currentLoadLevel: 0
    }
  });

  await prisma.branchConfig.upsert({
    where: { branchId: branch.id },
    update: { configJson },
    create: {
      id: randomUUID(),
      branchId: branch.id,
      configJson
    }
  });
}

async function seedKempenHours(branchId, menuData) {
  for (const entry of menuData.openingHours.delivery) {
    if (entry.closed) {
      await prisma.branchHours.upsert({
        where: { branchId_dayOfWeek: { branchId, dayOfWeek: entry.day } },
        update: { openTime: "00:00", closeTime: "00:00" },
        create: {
          id: randomUUID(),
          branchId,
          dayOfWeek: entry.day,
          openTime: "00:00",
          closeTime: "00:00"
        }
      });
      continue;
    }

    await prisma.branchHours.upsert({
      where: { branchId_dayOfWeek: { branchId, dayOfWeek: entry.day } },
      update: { openTime: entry.open, closeTime: entry.close },
      create: {
        id: randomUUID(),
        branchId,
        dayOfWeek: entry.day,
        openTime: entry.open,
        closeTime: entry.close
      }
    });
  }
}

async function seedKempenDeliveryZone(branchId, menuData) {
  const areas = menuData.deliveryAreas ?? [];
  const minOrder = areas.length
    ? Math.min(...areas.map((a) => a.minimumOrder))
    : 15;
  const baseFee = areas.length
    ? Math.min(...areas.map((a) => a.deliveryFee))
    : 2;

  await prisma.deliveryZone.upsert({
    where: { branchId },
    update: {
      maxDistanceKm: 12,
      baseFee,
      perKmFee: 0,
      minimumOrderAmount: minOrder
    },
    create: {
      id: randomUUID(),
      branchId,
      maxDistanceKm: 12,
      baseFee,
      perKmFee: 0,
      minimumOrderAmount: minOrder
    }
  });
}

async function clearBranchMenu(branchId) {
  const existingItems = await prisma.branchMenuItem.findMany({
    where: { branchId },
    select: { menuItemId: true }
  });
  const menuItemIds = existingItems.map((entry) => entry.menuItemId);

  await prisma.branchMenuItem.deleteMany({ where: { branchId } });
  await prisma.branchCategory.deleteMany({ where: { branchId } });
  await prisma.branchItemPricing.deleteMany({ where: { branchId } });

  if (menuItemIds.length) {
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
}

async function importKempenMenu(branchId, menuData) {
  await clearBranchMenu(branchId);

  let itemCounter = 10000;
  const categoryMap = new Map();

  for (const category of menuData.categories) {
    const branchCategory = await prisma.branchCategory.create({
      data: {
        branchId,
        name: category.name
      }
    });
    categoryMap.set(category.name, branchCategory.id);
  }

  for (const product of menuData.products) {
    const categoryId = categoryMap.get(product.categoryName);
    if (!categoryId) continue;

    const isPizza =
      product.categoryName?.toLowerCase().includes("pizza") ||
      product.name?.toLowerCase().startsWith("pizza");

    const menuItem = await prisma.menuItem.create({
      data: {
        id: itemCounter++,
        name: product.name,
        description: product.description,
        basePrice: product.priceDelivery,
        isAvailable: true,
        kitchen: isPizza ? "A" : "B"
      }
    });

    await prisma.branchMenuItem.create({
      data: {
        branchId,
        menuItemId: menuItem.id,
        price: product.priceDelivery,
        description: product.description,
        isAvailable: true,
        categoryId
      }
    });

    if (product.pricePickup !== product.priceDelivery) {
      await prisma.branchItemPricing.create({
        data: {
          id: randomUUID(),
          branchId,
          menuItemId: menuItem.id,
          price: product.pricePickup
        }
      });
    }

    if (product.sizes.length > 0) {
      const groupId = `size-${branchId}-${menuItem.id}`;
      await prisma.variantGroup.create({
        data: {
          id: groupId,
          name: "Größe",
          itemId: menuItem.id,
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
      const groupId = `extra-${branchId}-${menuItem.id}-${index}`;
      await prisma.addOnGroup.create({
        data: {
          id: groupId,
          name: group.name ?? "Extras",
          itemId: menuItem.id,
          required: group.required,
          minSelect: group.min,
          maxSelect: group.max || 99
        }
      });

      for (const option of group.options) {
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
      const groupId = `choice-${branchId}-${menuItem.id}-${index}`;
      const groupName =
        group.name ??
        (group.options?.[0]?.name?.includes("Spaghetti") ? "Nudelsorte" : "Wählen Sie");
      await prisma.variantGroup.create({
        data: {
          id: groupId,
          name: groupName,
          itemId: menuItem.id,
          required: group.required !== false,
          minSelect: group.required !== false ? 1 : 0,
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
}

async function seedAdminUsers() {
  const defaultPassword = requireSeedPassword();
  const hash = await bcrypt.hash(defaultPassword, 10);

  await prisma.admin.upsert({
    where: { email: "owner@concordia.de" },
    update: { password: hash, name: "Owner", role: "admin", branchId: null },
    create: {
      id: "admin-owner",
      email: "owner@concordia.de",
      password: hash,
      name: "Owner",
      role: "admin",
      branchId: null
    }
  });

  await prisma.admin.upsert({
    where: { email: "kempen@concordia.de" },
    update: {
      password: hash,
      name: "Kempen Manager",
      role: "manager",
      branchId: "concordia-kempen"
    },
    create: {
      id: "admin-kempen",
      email: "kempen@concordia.de",
      password: hash,
      name: "Kempen Manager",
      role: "manager",
      branchId: "concordia-kempen"
    }
  });

  console.log("  ✓ Admin users (owner@concordia.de, kempen@concordia.de)");
}

async function main() {
  const menuData = loadMenuData();

  console.log("Seeding Concordia branches...");

  for (const branch of BRANCHES) {
    await upsertBranch(branch, menuData);
    console.log(`  ✓ ${branch.name} (${branch.status})`);
  }

  await seedKempenHours("concordia-kempen", menuData);
  await seedKempenDeliveryZone("concordia-kempen", menuData);
  await importKempenMenu("concordia-kempen", menuData);

  console.log(
    `Imported Kempen menu: ${menuData.stats.totalProducts} items, ` +
      `${menuData.stats.withSizes} with sizes, ` +
      `${menuData.stats.withExtras} with extras`
  );

  await seedAdminUsers();
  console.log("Done.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
