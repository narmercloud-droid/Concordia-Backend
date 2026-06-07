import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const items = await prisma.menuItem.findMany({
  where: { id: { gte: 10000, lt: 20000 }, itemNumber: null },
  select: { id: true, name: true },
  orderBy: { id: "asc" }
});

console.log(`Unnumbered (${items.length}):`);
for (const item of items) {
  console.log(`  ${item.id}: ${item.name}`);
}

await prisma.$disconnect();
