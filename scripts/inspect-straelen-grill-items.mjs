import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const BRANCH_ID = "concordia-straelen";
const GRILL = ["160", "161", "162", "163", "164"];

const items = await prisma.menuItem.findMany({
  where: { itemNumber: { in: GRILL } },
  include: {
    variantGroups: { include: { variants: true }, orderBy: { name: "asc" } },
    addOnGroups: { include: { addOns: true } }
  },
  orderBy: { itemNumber: "asc" }
});

for (const item of items) {
  console.log(`\n#${item.itemNumber} ${item.name}`);
  for (const g of item.variantGroups) {
    console.log(`  ${g.name} (required=${g.required}, included=${g.includedChoice})`);
    for (const v of g.variants) console.log(`    - ${v.name}`);
  }
  if (item.addOnGroups.length) console.log(`  Add-ons: ${item.addOnGroups.map((g) => g.name).join(", ")}`);
}

await prisma.$disconnect();
