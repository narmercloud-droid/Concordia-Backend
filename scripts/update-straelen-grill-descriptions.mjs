/**
 * Update Straelen Grill-Gerichte descriptions.
 * Run: node scripts/update-straelen-grill-descriptions.mjs
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const BRANCH_ID = "concordia-straelen";
const GRILL_ITEM_NUMBERS = ["160", "161", "162", "163", "164"];

const DESCRIPTION =
  "Mit Grilltomate, Peperoni, Pommes oder Reis und Salat";

async function main() {
  const entries = await prisma.branchMenuItem.findMany({
    where: {
      branchId: BRANCH_ID,
      menuItem: { itemNumber: { in: GRILL_ITEM_NUMBERS } }
    },
    include: { menuItem: true },
    orderBy: { menuItem: { itemNumber: "asc" } }
  });

  for (const entry of entries) {
    await prisma.branchMenuItem.update({
      where: { id: entry.id },
      data: { description: DESCRIPTION }
    });
    console.log(`  ✓ #${entry.menuItem.itemNumber} ${entry.menuItem.name}`);
  }

  console.log(`\nUpdated ${entries.length} items. Bust menu cache on Render if needed.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
