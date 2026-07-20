/**
 * Upsert Straelen Döner-Menü combo coupon (döner + fries + 0.33 l drink for €10).
 * Safe to re-run.
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const BRANCH_ID = "concordia-straelen";
const CAMPAIGN_ID = "straelen-doner-menu-combo";

async function main() {
  const branch = await prisma.branch.findUnique({ where: { id: BRANCH_ID } });
  if (!branch) {
    throw new Error(`Branch not found: ${BRANCH_ID}`);
  }

  const campaign = await prisma.couponCampaign.upsert({
    where: { id: CAMPAIGN_ID },
    create: {
      id: CAMPAIGN_ID,
      branchId: BRANCH_ID,
      title: "Döner-Menü — 10 €",
      description:
        "Dönersandwich + Pommes frites + Getränk 0,33 l — alles zusammen für nur 10 €.",
      discountType: "combo",
      discountValue: 10,
      minOrder: 10,
      newCustomersOnly: false,
      sortOrder: 10,
      isActive: true
    },
    update: {
      branchId: BRANCH_ID,
      title: "Döner-Menü — 10 €",
      description:
        "Dönersandwich + Pommes frites + Getränk 0,33 l — alles zusammen für nur 10 €.",
      discountType: "combo",
      discountValue: 10,
      minOrder: 10,
      isActive: true,
      sortOrder: 10
    }
  });

  console.log(`✓ Upserted coupon campaign: ${campaign.title} (${campaign.id})`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
