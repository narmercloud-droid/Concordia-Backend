import { PrismaClient } from "@prisma/client";

const branchId = process.argv[2] || "concordia-straelen";
const prisma = new PrismaClient();

const item = await prisma.branchMenuItem.findFirst({
  where: { branchId, isAvailable: true },
  include: { menuItem: true },
  orderBy: { menuItemId: "asc" }
});

if (!item) {
  console.error("No menu item found for", branchId);
  process.exit(1);
}

console.log(
  JSON.stringify({
    branchId,
    itemId: item.menuItemId,
    name: item.menuItem.name,
    price: item.price ?? item.menuItem.basePrice
  })
);

await prisma.$disconnect();
