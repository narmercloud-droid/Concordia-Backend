/**
 * One-off: replace Kempen-copied delivery areas on concordia-straelen with Straelen region postcodes.
 */
import { PrismaClient } from "@prisma/client";

const STRAELEN_DELIVERY_AREAS = [
  { city: "Straelen", postalCode: "47638", deliveryFee: 2, minimumOrder: 15 },
  { city: "Kerken", postalCode: "47647", deliveryFee: 2, minimumOrder: 20 },
  { city: "Wachtendonk", postalCode: "47669", deliveryFee: 2, minimumOrder: 20 },
  { city: "Kevelaer", postalCode: "47626", deliveryFee: 2, minimumOrder: 20 },
  { city: "Kevelaer", postalCode: "47624", deliveryFee: 2, minimumOrder: 20 },
  { city: "Kevelaer", postalCode: "47623", deliveryFee: 2, minimumOrder: 20 },
  { city: "Rheurdt", postalCode: "47589", deliveryFee: 2, minimumOrder: 20 },
  { city: "Goch", postalCode: "47574", deliveryFee: 2, minimumOrder: 25 },
  { city: "Bedburg-Hau", postalCode: "47551", deliveryFee: 2, minimumOrder: 25 },
  { city: "Kleve", postalCode: "47533", deliveryFee: 3, minimumOrder: 30 },
  { city: "Geldern", postalCode: "47608", deliveryFee: 3, minimumOrder: 30 }
];

const prisma = new PrismaClient();

const row = await prisma.branchConfig.findUnique({
  where: { branchId: "concordia-straelen" }
});

if (!row) {
  console.error("concordia-straelen BranchConfig not found");
  process.exit(1);
}

const configJson = { ...(row.configJson ?? {}) };
configJson.deliveryAreas = STRAELEN_DELIVERY_AREAS;

await prisma.branchConfig.update({
  where: { branchId: "concordia-straelen" },
  data: { configJson }
});

console.log("Updated Straelen deliveryAreas:", STRAELEN_DELIVERY_AREAS.length, "postcodes");
await prisma.$disconnect();
