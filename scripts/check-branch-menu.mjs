import { PrismaClient } from "@prisma/client";

const branchId = process.argv[2] || "concordia-kempen";
const prisma = new PrismaClient();

const cats = await prisma.branchCategory.count({ where: { branchId } });
const items = await prisma.branchMenuItem.count({ where: { branchId } });
const menuItems = await prisma.menuItem.count({ where: { id: { gte: 10000 } } });
const groups = await prisma.variantGroup.count({
  where: { id: { contains: branchId } }
});

const sample = await prisma.menuItem.findMany({
  where: { id: { gte: 10000 } },
  take: 3,
  select: { id: true, name: true }
});

console.log({ branchId, cats, branchMenuItems: items, menuItemsGte10000: menuItems, variantGroupsForBranch: groups, sample });
await prisma.$disconnect();
