/**
 * Configure Straelen delivery by radius zones + set Kempen live.
 * Run: node scripts/configure-straelen-delivery-radius.mjs
 */
import { PrismaClient } from "@prisma/client";
import { invalidateBranchListCache } from "../dist/services/customer/branchMenu.service.js";

const prisma = new PrismaClient();

const STRAELEN_ZONES = [
  {
    maxDistanceKm: 3,
    minimumOrder: 9.99,
    deliveryFee: 2,
    freeDeliveryMinimum: 15,
    label: "0–3 km"
  },
  {
    maxDistanceKm: 5,
    minimumOrder: 9.99,
    deliveryFee: 2,
    freeDeliveryMinimum: 15,
    label: "3–5 km"
  },
  {
    maxDistanceKm: 7,
    minimumOrder: 15,
    deliveryFee: 2,
    freeDeliveryMinimum: 20,
    label: "5–7 km"
  }
];

async function setBranchStatus(branchId, status) {
  const row = await prisma.branchConfig.findUnique({ where: { branchId } });
  if (!row) throw new Error(`No BranchConfig for ${branchId}`);
  await prisma.branchConfig.update({
    where: { branchId },
    data: {
      configJson: {
        ...(row.configJson ?? {}),
        status
      }
    }
  });
  console.log(`  ✓ ${branchId} → status: ${status}`);
}

async function configureStraelenDelivery() {
  const row = await prisma.branchConfig.findUnique({
    where: { branchId: "concordia-straelen" }
  });
  if (!row) throw new Error("concordia-straelen BranchConfig not found");

  await prisma.branchConfig.update({
    where: { branchId: "concordia-straelen" },
    data: {
      configJson: {
        ...(row.configJson ?? {}),
        supportsDelivery: true,
        deliveryMode: "radius",
        freeDeliveryAtMinimum: false,
        deliveryRadiusZones: STRAELEN_ZONES
      }
    }
  });
  console.log("  ✓ Straelen delivery radius zones configured (max 7 km)");
  for (const z of STRAELEN_ZONES) {
    console.log(
      `    ${z.label}: min €${z.minimumOrder}, fee €${z.deliveryFee}, free from €${z.freeDeliveryMinimum}`
    );
  }
}

async function main() {
  await setBranchStatus("concordia-kempen", "live");
  await configureStraelenDelivery();
  invalidateBranchListCache();
  console.log("\nBranch list cache invalidated (local memory; bust Redis on Render for production API).");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
