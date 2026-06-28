/**
 * Disable PayPal checkout for all Concordia branches (shows "Coming soon" in the app).
 *
 * Usage: node scripts/set-paypal-coming-soon.mjs
 */
import { PrismaClient } from "@prisma/client";

const BRANCHES = ["concordia-kempen", "concordia-straelen"];
const prisma = new PrismaClient();

async function main() {
  for (const branchId of BRANCHES) {
    await prisma.branchPaymentSettings.upsert({
      where: { branchId },
      create: { branchId, paypalEnabled: false },
      update: { paypalEnabled: false }
    });
    console.log(`PayPal disabled (coming soon) for ${branchId}`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
