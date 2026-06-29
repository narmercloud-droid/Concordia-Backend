import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const BRANCH_ID = "concordia-straelen";
const nums = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ["80", "81", "82", "83", "84", "87", "89", "90", "94"];

const rows = await prisma.branchMenuItem.findMany({
  where: {
    branchId: BRANCH_ID,
    menuItem: { itemNumber: { in: nums } }
  },
  include: {
    menuItem: {
      include: {
        variantGroups: { include: { variants: true }, orderBy: { name: "asc" } },
        addOnGroups: { include: { addOns: true }, orderBy: { name: "asc" } }
      }
    },
    category: true
  },
  orderBy: { menuItem: { itemNumber: "asc" } }
});

for (const r of rows) {
  const m = r.menuItem;
  console.log(`--- #${m.itemNumber} id=${m.id} ${m.name}`);
  console.log(`    category: ${r.category?.name}`);
  for (const g of m.variantGroups) {
    console.log(
      `    variant [${g.name}] included=${g.includedChoice} required=${g.required} min=${g.minSelect} max=${g.maxSelect}`
    );
    for (const v of g.variants) console.log(`      - ${v.name} (${v.price})`);
  }
  for (const g of m.addOnGroups) {
    console.log(`    addon [${g.name}]`);
    for (const a of g.addOns) console.log(`      - ${a.name} (${a.price})`);
  }
}

if (!rows.length) console.log("No items found for:", nums.join(", "));

await prisma.$disconnect();
