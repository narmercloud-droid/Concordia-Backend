import { PrismaClient } from "@prisma/client";

const branchId = process.argv[2] || "concordia-straelen";
const prisma = new PrismaClient();

const items = await prisma.branchMenuItem.findMany({
  where: { branchId, isAvailable: true },
  include: {
    menuItem: {
      include: {
        optionGroups: {
          include: { options: true }
        }
      }
    }
  },
  take: 30,
  orderBy: { menuItemId: "asc" }
});

for (const row of items) {
  const groups = row.menuItem.optionGroups ?? [];
  const required = groups.filter((g) => g.required);
  if (required.length === 0 && groups.length === 0) {
    console.log(
      JSON.stringify({
        itemId: row.menuItemId,
        name: row.menuItem.name,
        price: row.price ?? row.menuItem.basePrice,
        groups: 0
      })
    );
    break;
  }
}

// Also show Margherita variants
const marg = items.find((i) => i.menuItemId === 20000);
if (marg) {
  console.log(
    "Margherita options:",
    JSON.stringify(
      marg.menuItem.optionGroups.map((g) => ({
        name: g.name,
        required: g.required,
        options: g.options.map((o) => ({ id: o.id, name: o.name, price: o.price }))
      })),
      null,
      2
    )
  );
}

await prisma.$disconnect();
