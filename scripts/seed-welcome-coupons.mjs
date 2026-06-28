/**
 * Seed welcome coupon campaigns for Concordia branches.
 *
 * Usage: node scripts/seed-welcome-coupons.mjs
 */
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const BRANCHES = [
  {
    id: "concordia-kempen",
    title: "Willkommen bei Concordia Kempen",
    description: "10 % Rabatt auf deine erste Bestellung — nur für registrierte Kunden.",
    discountType: "percent",
    discountValue: 10,
    minOrder: 15
  },
  {
    id: "concordia-straelen",
    title: "Willkommen bei Concordia Straelen",
    description: "10 % Rabatt auf deine erste Bestellung — nur für registrierte Kunden.",
    discountType: "percent",
    discountValue: 10,
    minOrder: 15
  }
];

const prisma = new PrismaClient();

async function upsertBranchWelcomeCoupon(branch) {
  const existing = await prisma.couponCampaign.findFirst({
    where: {
      branchId: branch.id,
      newCustomersOnly: true,
      title: branch.title
    }
  });

  if (existing) {
    console.log(`Already exists: ${branch.id} → ${existing.id}`);
    return existing;
  }

  const row = await prisma.couponCampaign.create({
    data: {
      id: randomUUID(),
      branchId: branch.id,
      title: branch.title,
      description: branch.description,
      discountType: branch.discountType,
      discountValue: branch.discountValue,
      minOrder: branch.minOrder,
      newCustomersOnly: true,
      isActive: true,
      sortOrder: 0
    }
  });
  console.log(`Created welcome coupon for ${branch.id}: ${row.id}`);
  return row;
}

async function upsertPlatformCoupon() {
  const title = "Concordia App-Gutschein";
  const existing = await prisma.couponCampaign.findFirst({
    where: { branchId: null, title }
  });
  if (existing) {
    console.log(`Platform coupon already exists: ${existing.id}`);
    return existing;
  }

  const row = await prisma.couponCampaign.create({
    data: {
      id: randomUUID(),
      branchId: null,
      title,
      description: "5 € Rabatt bei Registrierung — gültig in allen Filialen.",
      discountType: "fixed",
      discountValue: 5,
      minOrder: 20,
      newCustomersOnly: true,
      isActive: true,
      sortOrder: 1
    }
  });
  console.log(`Created platform coupon: ${row.id}`);
  return row;
}

async function main() {
  for (const branch of BRANCHES) {
    await upsertBranchWelcomeCoupon(branch);
  }
  await upsertPlatformCoupon();
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
