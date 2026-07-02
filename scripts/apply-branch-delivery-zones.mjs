/**
 * Apply Concordia standard delivery radius zones to Kempen + Straelen.
 * Usage: node scripts/apply-branch-delivery-zones.mjs
 */
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

const BRANCH_IDS = ["concordia-kempen", "concordia-straelen"];

const DELIVERY_RADIUS_ZONES = [
  {
    maxDistanceKm: 5,
    minimumOrder: 9.99,
    deliveryFee: 2,
    freeDeliveryMinimum: 15,
    label: "0–5 km"
  },
  {
    maxDistanceKm: 7,
    minimumOrder: 9.99,
    deliveryFee: 3,
    freeDeliveryMinimum: 18,
    label: "5–7 km"
  },
  {
    maxDistanceKm: 10,
    minimumOrder: 9.99,
    deliveryFee: 3,
    freeDeliveryMinimum: 20,
    label: "7–10 km"
  }
];

async function applyToBranch(branchId) {
  const branch = await prisma.branch.findUnique({ where: { id: branchId } });
  if (!branch) {
    console.warn(`Skip ${branchId}: branch not found`);
    return;
  }

  const existing = await prisma.branchConfig.findUnique({ where: { branchId } });
  const current = (existing?.configJson ?? {}) ;

  const configJson = {
    ...current,
    deliveryMode: "radius",
    freeDeliveryAtMinimum: false,
    deliveryRadiusZones: DELIVERY_RADIUS_ZONES
  };

  await prisma.branchConfig.upsert({
    where: { branchId },
    update: { configJson, version: { increment: 1 } },
    create: {
      id: randomUUID(),
      branchId,
      configJson
    }
  });

  console.log(`Updated ${branchId} (${branch.name})`);
  for (const zone of DELIVERY_RADIUS_ZONES) {
    console.log(
      `  • ${zone.label}: min €${zone.minimumOrder}, fee €${zone.deliveryFee}, free from €${zone.freeDeliveryMinimum}`
    );
  }
}

async function main() {
  for (const branchId of BRANCH_IDS) {
    await applyToBranch(branchId);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
