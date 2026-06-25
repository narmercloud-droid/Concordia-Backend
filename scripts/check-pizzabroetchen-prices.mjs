import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const branches = ["concordia-kempen", "concordia-straelen"];

for (const branchId of branches) {
  const items = await prisma.branchMenuItem.findMany({
    where: { branchId, category: { name: { contains: "Pizzabr" } } },
    include: { menuItem: true, category: true },
    orderBy: { menuItem: { itemNumber: "asc" } }
  });
  console.log(`\n=== ${branchId} (${items.length} items) ===`);
  for (const e of items) {
    const vg = await prisma.variantGroup.findMany({
      where: { itemId: e.menuItemId },
      include: { variants: true }
    });
    const prices = vg.flatMap((g) =>
      g.variants.map((v) => `${v.name}:${Number(v.price).toFixed(2)}`)
    );
    const base = e.price ?? e.menuItem.basePrice;
    console.log(
      `#${e.menuItem.itemNumber ?? "?"} ${e.menuItem.name} base=${base ?? "null"} ${prices.join(" | ") || "(no variants)"}`
    );
  }
}

await prisma.$disconnect();
