/**
 * Configure Straelen Grill-Gerichte item options (free included choices).
 *
 * Items 160–164: Beilage Reis/Pommes + Salatsoße (same sauces as Döner plates)
 *
 * Run: node scripts/configure-straelen-grill-extras.mjs
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const BRANCH_ID = "concordia-straelen";

const GRILL_ITEMS = ["160", "161", "162", "163", "164"];

const SAUCE_OPTIONS = [
  { name: "Joghurtsauce", price: 0 },
  { name: "Hot Sauce", price: 0 },
  { name: "Tzatzikisauce", price: 0 },
  { name: "Cocktailsauce", price: 0 },
  { name: "Special Sauce", price: 0 },
  { name: "Ohne Sauce", price: 0 }
];

const SIDE_OPTIONS = [
  { name: "Reis", price: 0 },
  { name: "Pommes", price: 0 }
];

async function clearItemOptions(itemId) {
  await prisma.addOn.deleteMany({ where: { group: { itemId } } });
  await prisma.addOnGroup.deleteMany({ where: { itemId } });
  await prisma.variant.deleteMany({ where: { group: { itemId } } });
  await prisma.variantGroup.deleteMany({ where: { itemId } });
}

async function upsertVariantChoiceGroup(itemId, suffix, groupName, options) {
  const groupId = `choice-${BRANCH_ID}-${itemId}-${suffix}`;
  await prisma.variantGroup.upsert({
    where: { id: groupId },
    update: {
      name: groupName,
      required: true,
      minSelect: 1,
      maxSelect: 1,
      includedChoice: true
    },
    create: {
      id: groupId,
      name: groupName,
      itemId,
      required: true,
      minSelect: 1,
      maxSelect: 1,
      includedChoice: true
    }
  });

  for (const [i, opt] of options.entries()) {
    const id = `${groupId}-${i}`;
    await prisma.variant.upsert({
      where: { id },
      update: { name: opt.name, price: opt.price },
      create: { id, name: opt.name, price: opt.price, groupId }
    });
  }
}

async function configureGrillItem(itemId, itemNumber, name) {
  await clearItemOptions(itemId);
  await upsertVariantChoiceGroup(itemId, "beilage", "Beilage", SIDE_OPTIONS);
  await upsertVariantChoiceGroup(itemId, "salat-sauce", "Salatsoße", SAUCE_OPTIONS);
  console.log(`  ✓ #${itemNumber} ${name}`);
}

async function main() {
  const entries = await prisma.branchMenuItem.findMany({
    where: {
      branchId: BRANCH_ID,
      menuItem: { itemNumber: { in: GRILL_ITEMS } }
    },
    include: { menuItem: true },
    orderBy: { menuItem: { itemNumber: "asc" } }
  });

  const byNumber = new Map(entries.map((e) => [String(e.menuItem.itemNumber), e.menuItem]));

  for (const num of GRILL_ITEMS) {
    const item = byNumber.get(num);
    if (!item) {
      console.warn(`  ! Item #${num} not found on Straelen menu`);
      continue;
    }
    await configureGrillItem(item.id, num, item.name);
  }

  console.log("\nDone. Menu cache will refresh within ~30 min, or redeploy / bust Redis on Render.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
