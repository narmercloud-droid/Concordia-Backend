/**
 * Upsert Straelen Döner-Menü combo coupon (döner + fries + 0.33 l drink for €10).
 * Safe to re-run.
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const BRANCH_ID = "concordia-straelen";
const CAMPAIGN_ID = "straelen-doner-menu-combo";
/** Set to null when the offer goes live. */
const COMING_SOON_VALID_FROM = new Date("2099-01-01T00:00:00.000Z");

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
      title: "Döner + Pommes + Getränk nach Wahl",
      description:
        "Dönertasche, Pommes frites und ein Getränk 0,33 l nach Wahl — alles zusammen für 10 €.",
      discountType: "fixed",
      discountValue: 3,
      minOrder: 0,
      newCustomersOnly: false,
      sortOrder: 10,
      validFrom: COMING_SOON_VALID_FROM,
      isActive: true
    },
    update: {
      branchId: BRANCH_ID,
      title: "Döner + Pommes + Getränk nach Wahl",
      description:
        "Dönertasche, Pommes frites und ein Getränk 0,33 l nach Wahl — alles zusammen für 10 €.",
      discountType: "fixed",
      discountValue: 3,
      minOrder: 0,
      validFrom: COMING_SOON_VALID_FROM,
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
