/**
 * Align Kempen branch menu numbers, names, and prices with the printed flyer.
 * Usage: node scripts/fix-kempen-flyer-menu.mjs
 */
import { PrismaClient } from "@prisma/client";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { numberSortKey } from "./kempen-menu-numbers.mjs";

const BRANCH_ID = "concordia-kempen";
const prisma = new PrismaClient();
const scriptsDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(scriptsDir, "..");

/** Explicit itemNumber + optional rename (flyer wording). */
const ITEM_FIXES = [
  // Pizzen #06–#11
  { id: 10070, itemNumber: "06" },
  { id: 10000, itemNumber: "07" },
  { id: 10071, itemNumber: "07" },
  { id: 10072, itemNumber: "08" },
  { id: 10073, itemNumber: "09" },
  { id: 10074, itemNumber: "10" },
  { id: 10055, itemNumber: "11" },
  // Pizzen #24–#27
  { id: 10038, itemNumber: "24" },
  { id: 10039, itemNumber: "25" },
  { id: 10040, itemNumber: "26" },
  { id: 10041, itemNumber: "27" },
  // Pizzabrötchen #47–#53
  { id: 10082, itemNumber: "47" },
  { id: 10083, itemNumber: "48" },
  { id: 10077, itemNumber: "49" },
  { id: 10075, itemNumber: "50" },
  { id: 10076, itemNumber: "51" },
  { id: 10080, itemNumber: "52" },
  { id: 10078, itemNumber: "53" },
  // Imbiss #82–#90 + sauces
  { id: 10113, itemNumber: "82", name: "Bratrolle mit Pommes" },
  { id: 10108, itemNumber: "83", name: "Bratrolle Spezial mit Pommes" },
  { id: 10109, itemNumber: "84", name: "Bratwurst mit Pommes" },
  { id: 10110, itemNumber: "85", name: "Currywurst mit Pommes" },
  { id: 10101, itemNumber: "86", name: "Chicken Nuggets 6 Stück mit Pommes" },
  { id: 10102, itemNumber: "87", name: "Chicken Wings 8 Stück mit Pommes" },
  { id: 10103, itemNumber: "88" },
  { id: 10106, itemNumber: "89", name: "Mozzarella Sticks 6 Stück mit Pommes" },
  { id: 10107, itemNumber: "90", name: "Rindfleischkrokette mit Pommes" },
  { id: 10104, itemNumber: "95" },
  { id: 10105, itemNumber: "96" },
  // Baguettes #163–#167
  { id: 10007, itemNumber: "163" },
  { id: 10003, itemNumber: "164" },
  { id: 10002, itemNumber: "165" },
  { id: 10005, itemNumber: "166" },
  { id: 10004, itemNumber: "167" },
  // Drinks
  { id: 10114, basePrice: 3 },
  { id: 10128, basePrice: 3 },
  { id: 10129, name: "Krombacher Pils 0,5l" }
];

const NEW_ITEMS = [
  {
    id: 10130,
    itemNumber: "200",
    name: "Partyblech Margherita",
    description: "40 x 60 cm · jede weitere Zutat +5,00 €",
    basePrice: 26,
    sortOrder: 2000
  },
  {
    id: 10131,
    itemNumber: "201",
    name: "Familien-Pizza Margherita",
    description: "45 cm · jede weitere Zutat +3,00 €",
    basePrice: 17,
    sortOrder: 2010
  }
];

async function applyItemFixes() {
  for (const fix of ITEM_FIXES) {
    const data = {};
    if (fix.itemNumber != null) {
      data.itemNumber = fix.itemNumber;
      data.sortOrder = numberSortKey(fix.itemNumber);
    }
    if (fix.name != null) data.name = fix.name;
    if (fix.basePrice != null) data.basePrice = fix.basePrice;

    await prisma.menuItem.update({ where: { id: fix.id }, data });

    const branchRow = await prisma.branchMenuItem.findFirst({
      where: { branchId: BRANCH_ID, menuItemId: fix.id }
    });
    if (branchRow && fix.basePrice != null) {
      await prisma.branchMenuItem.update({
        where: { id: branchRow.id },
        data: { price: fix.basePrice }
      });
    }

    const label = fix.itemNumber ? `#${fix.itemNumber}` : `id ${fix.id}`;
    console.log(`Updated ${label} (${fix.id})${fix.name ? ` → ${fix.name}` : ""}`);
  }
}

async function ensurePartyItems() {
  const pizzenCategory = await prisma.branchCategory.findFirst({
    where: { branchId: BRANCH_ID, name: "Pizzen" }
  });
  if (!pizzenCategory) throw new Error("Pizzen category not found");

  for (const item of NEW_ITEMS) {
    const existing = await prisma.menuItem.findUnique({ where: { id: item.id } });
    if (!existing) {
      await prisma.menuItem.create({
        data: {
          id: item.id,
          name: item.name,
          description: item.description,
          basePrice: item.basePrice,
          itemNumber: item.itemNumber,
          sortOrder: item.sortOrder,
          kitchen: "A"
        }
      });
      console.log(`Created #${item.itemNumber} ${item.name}`);
    } else {
      await prisma.menuItem.update({
        where: { id: item.id },
        data: {
          name: item.name,
          description: item.description,
          basePrice: item.basePrice,
          itemNumber: item.itemNumber,
          sortOrder: item.sortOrder
        }
      });
      console.log(`Updated #${item.itemNumber} ${item.name}`);
    }

    const linked = await prisma.branchMenuItem.findFirst({
      where: { branchId: BRANCH_ID, menuItemId: item.id }
    });
    if (!linked) {
      await prisma.branchMenuItem.create({
        data: {
          branchId: BRANCH_ID,
          menuItemId: item.id,
          categoryId: pizzenCategory.id,
          price: item.basePrice,
          isAvailable: true
        }
      });
      console.log(`Linked #${item.itemNumber} to Kempen Pizzen`);
    } else {
      await prisma.branchMenuItem.update({
        where: { id: linked.id },
        data: { categoryId: pizzenCategory.id, price: item.basePrice, isAvailable: true }
      });
    }
  }
}

async function main() {
  console.log("Applying Kempen flyer menu fixes…");
  await applyItemFixes();
  await ensurePartyItems();
  console.log("Busting menu cache keys…");
  spawnSync(process.execPath, ["scripts/bust-menu-redis-cache.mjs"], {
    cwd: repoRoot,
    stdio: "inherit"
  });
  console.log("Done.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
