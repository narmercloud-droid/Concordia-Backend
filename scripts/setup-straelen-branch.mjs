/**
 * Open Concordia Straelen and copy the full Kempen menu (items + all extras/options).
 * Safe to re-run — replaces Straelen menu only, does not touch Kempen.
 */
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

const SOURCE_BRANCH = "concordia-kempen";
const TARGET_BRANCH = "concordia-straelen";
const ID_OFFSET = 10000;

const STRAELEN_CONFIG = {
  name: "Concordia Straelen",
  status: "live",
  city: "Straelen",
  address: "Venloer Straße 22",
  postalCode: "47638",
  lat: 51.4412,
  lng: 6.2684,
  terminalCode: "STRAELEN",
  websiteUrl: "https://www.pizzaconcordiall-straelen.de/",
  lieferandoUrl: "https://www.lieferando.de/speisekarte/pizzeria-concordia-ll"
};

function remapOptionId(id, sourceItemId, targetItemId) {
  return id
    .replace(SOURCE_BRANCH, TARGET_BRANCH)
    .replace(String(sourceItemId), String(targetItemId));
}

async function clearTargetMenu() {
  const existingItems = await prisma.branchMenuItem.findMany({
    where: { branchId: TARGET_BRANCH },
    select: { menuItemId: true }
  });
  const menuItemIds = existingItems.map((e) => e.menuItemId);

  await prisma.branchMenuItem.deleteMany({ where: { branchId: TARGET_BRANCH } });
  await prisma.branchCategory.deleteMany({ where: { branchId: TARGET_BRANCH } });
  await prisma.branchItemPricing.deleteMany({ where: { branchId: TARGET_BRANCH } });

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

async function cloneMenuItemOptions(sourceItemId, targetItemId) {
  const variantGroups = await prisma.variantGroup.findMany({
    where: { itemId: sourceItemId },
    include: { variants: true }
  });

  for (const group of variantGroups) {
    const newGroupId = remapOptionId(group.id, sourceItemId, targetItemId);
    await prisma.variantGroup.create({
      data: {
        id: newGroupId,
        name: group.name,
        itemId: targetItemId,
        required: group.required,
        minSelect: group.minSelect,
        maxSelect: group.maxSelect,
        includedChoice: group.includedChoice ?? false
      }
    });

    for (const variant of group.variants) {
      await prisma.variant.create({
        data: {
          id: remapOptionId(variant.id, sourceItemId, targetItemId),
          name: variant.name,
          price: variant.price,
          groupId: newGroupId
        }
      });
    }
  }

  const addOnGroups = await prisma.addOnGroup.findMany({
    where: { itemId: sourceItemId },
    include: { addOns: true }
  });

  for (const group of addOnGroups) {
    const newGroupId = remapOptionId(group.id, sourceItemId, targetItemId);
    await prisma.addOnGroup.create({
      data: {
        id: newGroupId,
        name: group.name,
        itemId: targetItemId,
        required: group.required,
        minSelect: group.minSelect,
        maxSelect: group.maxSelect
      }
    });

    for (const addOn of group.addOns) {
      await prisma.addOn.create({
        data: {
          id: remapOptionId(addOn.id, sourceItemId, targetItemId),
          name: addOn.name,
          price: addOn.price,
          groupId: newGroupId
        }
      });
    }
  }
}

async function copyMenuFromKempen() {
  await clearTargetMenu();

  const sourceItems = await prisma.menuItem.findMany({
    where: {
      id: { gte: 10000, lt: 20000 },
      isAvailable: true
    },
    orderBy: { id: "asc" }
  });

  const category = await prisma.branchCategory.create({
    data: {
      branchId: TARGET_BRANCH,
      name: "Menu"
    }
  });

  let copied = 0;

  for (const source of sourceItems) {
    const targetItemId = source.id + ID_OFFSET;

    await prisma.menuItem.create({
      data: {
        id: targetItemId,
        name: source.name,
        description: source.description,
        basePrice: source.basePrice,
        imageUrl: source.imageUrl,
        isAvailable: source.isAvailable,
        kitchen: source.kitchen
      }
    });

    await prisma.branchMenuItem.create({
      data: {
        branchId: TARGET_BRANCH,
        menuItemId: targetItemId,
        price: source.basePrice,
        description: source.description,
        imageUrl: source.imageUrl,
        isAvailable: source.isAvailable,
        categoryId: category.id
      }
    });

    await cloneMenuItemOptions(source.id, targetItemId);
    copied++;
  }

  console.log(`Copied ${copied} menu items with all options to Straelen`);
}

async function copyHours() {
  const hours = await prisma.branchHours.findMany({
    where: { branchId: SOURCE_BRANCH }
  });

  for (const entry of hours) {
    await prisma.branchHours.upsert({
      where: {
        branchId_dayOfWeek: { branchId: TARGET_BRANCH, dayOfWeek: entry.dayOfWeek }
      },
      update: {
        openTime: entry.openTime,
        closeTime: entry.closeTime
      },
      create: {
        id: randomUUID(),
        branchId: TARGET_BRANCH,
        dayOfWeek: entry.dayOfWeek,
        openTime: entry.openTime,
        closeTime: entry.closeTime
      }
    });
  }

  console.log(`Copied ${hours.length} opening-hour rows`);
}

async function openStraelenBranch() {
  const kempenConfig = await prisma.branchConfig.findUnique({
    where: { branchId: SOURCE_BRANCH }
  });
  const kempen = (kempenConfig?.configJson ?? {});

  await prisma.branch.upsert({
    where: { id: TARGET_BRANCH },
    update: { name: STRAELEN_CONFIG.name },
    create: {
      id: TARGET_BRANCH,
      name: STRAELEN_CONFIG.name,
      printerType: "sunmi",
      printerUrl: null,
      avgPrepTimeBaseline: 20,
      currentLoadLevel: 0
    }
  });

  const configJson = {
    ...kempen,
    slug: "straelen",
    status: STRAELEN_CONFIG.status,
    city: STRAELEN_CONFIG.city,
    address: STRAELEN_CONFIG.address,
    postalCode: STRAELEN_CONFIG.postalCode,
    lat: STRAELEN_CONFIG.lat,
    lng: STRAELEN_CONFIG.lng,
    terminalCode: STRAELEN_CONFIG.terminalCode,
    websiteUrl: STRAELEN_CONFIG.websiteUrl,
    lieferandoUrl: STRAELEN_CONFIG.lieferandoUrl,
    supportsPickup: true,
    supportsDelivery: true
  };

  await prisma.branchConfig.upsert({
    where: { branchId: TARGET_BRANCH },
    update: { configJson },
    create: {
      id: `config-${TARGET_BRANCH}`,
      branchId: TARGET_BRANCH,
      configJson
    }
  });

  const kempenZone = await prisma.deliveryZone.findUnique({
    where: { branchId: SOURCE_BRANCH }
  });

  if (kempenZone) {
    await prisma.deliveryZone.upsert({
      where: { branchId: TARGET_BRANCH },
      update: {
        maxDistanceKm: kempenZone.maxDistanceKm,
        baseFee: kempenZone.baseFee,
        perKmFee: kempenZone.perKmFee,
        minimumOrderAmount: kempenZone.minimumOrderAmount
      },
      create: {
        id: randomUUID(),
        branchId: TARGET_BRANCH,
        maxDistanceKm: kempenZone.maxDistanceKm,
        baseFee: kempenZone.baseFee,
        perKmFee: kempenZone.perKmFee,
        minimumOrderAmount: kempenZone.minimumOrderAmount
      }
    });
  }

  console.log("Straelen branch opened (status: live)");
}

async function seedStraelenManager() {
  const bcrypt = await import("bcryptjs");
  const defaultPassword = process.env.SEED_ADMIN_PASSWORD || "Kempen2026!";
  const hash = await bcrypt.hash(defaultPassword, 10);

  await prisma.admin.upsert({
    where: { email: "straelen@concordia.de" },
    update: {
      password: hash,
      name: "Straelen Manager",
      role: "manager",
      branchId: TARGET_BRANCH
    },
    create: {
      id: "admin-straelen",
      email: "straelen@concordia.de",
      password: hash,
      name: "Straelen Manager",
      role: "manager",
      branchId: TARGET_BRANCH
    }
  });

  console.log("Manager: straelen@concordia.de");
}

async function main() {
  await openStraelenBranch();
  await copyHours();
  await copyMenuFromKempen();
  await seedStraelenManager();
  console.log("Straelen setup complete.");
  console.log(`Order URL path: /branch/${TARGET_BRANCH}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
