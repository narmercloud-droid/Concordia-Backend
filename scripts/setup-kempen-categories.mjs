/**
 * Create BranchCategory + BranchMenuItem links for Kempen from Lieferando JSON.
 */
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  KEMPEN_CATEGORY_LAYOUT,
  numberSortKey,
  resolveItemNumber
} from "./kempen-menu-numbers.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BRANCH_ID = process.env.SYNC_BRANCH_ID || "concordia-kempen";
const prisma = new PrismaClient();

const lieferando = JSON.parse(
  readFileSync(path.join(__dirname, "kempen-lieferando-complete.json"), "utf8")
);

function normalizeName(name) {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

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

async function findOrCreateCategory(name, sortOrder, description) {
  const existing = await prisma.branchCategory.findFirst({
    where: { branchId: BRANCH_ID, name }
  });
  if (existing) {
    return prisma.branchCategory.update({
      where: { id: existing.id },
      data: { sortOrder, description }
    });
  }
  return prisma.branchCategory.create({
    data: { branchId: BRANCH_ID, name, sortOrder, description }
  });
}

async function main() {
  await ensureColumns();

  const items = await prisma.menuItem.findMany({
    where: { id: { gte: 10000, lt: 20000 } },
    orderBy: { id: "asc" }
  });
  const itemByName = new Map(items.map((item) => [normalizeName(item.name), item]));

  let linked = 0;
  let categoriesCreated = 0;

  for (const [catIndex, cat] of (lieferando.categories ?? []).entries()) {
    const layout = KEMPEN_CATEGORY_LAYOUT.find((row) => row.name === cat.name);
    const category = await findOrCreateCategory(
      cat.name,
      layout?.sortOrder ?? 500 + catIndex,
      layout?.description ?? null
    );
    categoriesCreated += 1;

    for (const product of cat.products ?? []) {
      const menuItem = itemByName.get(normalizeName(product.name));
      if (!menuItem) continue;

      const itemNumber = resolveItemNumber(menuItem.name);
      const sortOrder = numberSortKey(itemNumber);

      await prisma.menuItem.update({
        where: { id: menuItem.id },
        data: { itemNumber, sortOrder }
      });

      const existing = await prisma.branchMenuItem.findFirst({
        where: { branchId: BRANCH_ID, menuItemId: menuItem.id }
      });

      if (existing) {
        await prisma.branchMenuItem.update({
          where: { id: existing.id },
          data: { categoryId: category.id, isAvailable: true }
        });
      } else {
        await prisma.branchMenuItem.create({
          data: {
            branchId: BRANCH_ID,
            menuItemId: menuItem.id,
            categoryId: category.id,
            isAvailable: true,
            price: menuItem.basePrice
          }
        });
      }
      linked += 1;
    }
  }

  console.log(`Categories: ${categoriesCreated}, items linked: ${linked}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
