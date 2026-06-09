import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

for (const id of [10001, 10065, 10018, 10093]) {
  const item = await prisma.menuItem.findUnique({
    where: { id },
    include: {
      variantGroups: { include: { variants: true } },
      addOnGroups: { include: { addOns: { take: 2 } } }
    }
  });
  console.log(
    id,
    item?.name,
    "variants:",
    item?.variantGroups.length,
    "addons:",
    item?.addOnGroups.length
  );
}

const items = await prisma.menuItem.findMany({
  where: { id: { gte: 10000 } },
  select: { id: true, name: true }
});

const byName = new Map();
for (const item of items) {
  const list = byName.get(item.name) ?? [];
  list.push(item.id);
  byName.set(item.name, list);
}

const dupes = [...byName.entries()].filter(([, ids]) => ids.length > 1);
console.log("Duplicate count:", dupes.length);
console.log("Examples:", dupes.slice(0, 5));

await prisma.$disconnect();
