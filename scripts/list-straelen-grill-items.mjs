import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const BRANCH_ID = "concordia-straelen";

const rows = await prisma.branchMenuItem.findMany({
  where: {
    branchId: BRANCH_ID,
    category: { name: { contains: "Grill", mode: "insensitive" } }
  },
  include: { menuItem: true, category: true },
  orderBy: { menuItem: { itemNumber: "asc" } }
});

for (const r of rows) {
  console.log(`#${r.menuItem.itemNumber} id=${r.menuItem.id} ${r.menuItem.name}`);
}
console.log(`\nTotal: ${rows.length} in category "${rows[0]?.category?.name ?? "?"}"`);

await prisma.$disconnect();
