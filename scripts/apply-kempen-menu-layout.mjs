/**
 * Apply printed-menu numbers, sort order, and category layout to Kempen branch.
 */
import { PrismaClient } from "@prisma/client";
import {
  KEMPEN_CATEGORY_LAYOUT,
  numberSortKey,
  resolveItemNumber
} from "./kempen-menu-numbers.mjs";

const BRANCH_ID = process.env.SYNC_BRANCH_ID || "concordia-kempen";
const prisma = new PrismaClient();

async function ensureColumns() {
  await prisma.$executeRawUnsafe(
    `ALTER TABLE "MenuItem" ADD COLUMN IF NOT EXISTS "itemNumber" TEXT`
  );
  await prisma.$executeRawUnsafe(
    `ALTER TABLE "MenuItem" ADD COLUMN IF NOT EXISTS "sortOrder" INTEGER NOT NULL DEFAULT 0`
  );
  await prisma.$executeRawUnsafe(
    `ALTER TABLE "BranchCategory" ADD COLUMN IF NOT EXISTS "sortOrder" INTEGER NOT NULL DEFAULT 0`
  );
  await prisma.$executeRawUnsafe(
    `ALTER TABLE "BranchCategory" ADD COLUMN IF NOT EXISTS "description" TEXT`
  );
}

async function applyCategoryLayout() {
  const categories = await prisma.branchCategory.findMany({
    where: { branchId: BRANCH_ID }
  });

  for (const cat of categories) {
    const layout = KEMPEN_CATEGORY_LAYOUT.find((row) => row.name === cat.name);
    await prisma.branchCategory.update({
      where: { id: cat.id },
      data: {
        sortOrder: layout?.sortOrder ?? 500,
        description: layout?.description ?? null
      }
    });
  }

  console.log(`Updated ${categories.length} categories`);
}

async function applyItemNumbers() {
  const idRange =
    BRANCH_ID === "concordia-straelen"
      ? { gte: 20000, lt: 30000 }
      : { gte: 10000, lt: 20000 };

  const items = await prisma.menuItem.findMany({
    where: { id: idRange },
    orderBy: { id: "asc" }
  });

  let matched = 0;
  for (const item of items) {
    const itemNumber = resolveItemNumber(item.name);
    const sortOrder = numberSortKey(itemNumber);
    if (itemNumber) matched += 1;

    await prisma.menuItem.update({
      where: { id: item.id },
      data: { itemNumber, sortOrder }
    });
  }

  console.log(`Updated ${items.length} items (${matched} with menu numbers)`);
}

await ensureColumns();
await applyCategoryLayout();
await applyItemNumbers();
await prisma.$disconnect();
