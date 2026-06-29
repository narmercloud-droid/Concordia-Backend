/**
 * Configure Straelen Döner item options (free choices + paid extras).
 *
 * Items 80, 81, 87, 89, 90: meat + sauce (free), Extra Fleisch + Weißkäse (paid)
 * Items 82, 83, 84: meat + Beilage Reis/Pommes + Salatsoße (free), paid extras
 * Item 94: Salatsoße only (Pommes included, no meat, no paid extras)
 *
 * Run: node scripts/configure-straelen-doner-extras.mjs
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const BRANCH_ID = "concordia-straelen";

const WRAP_ITEMS = ["80", "81", "87", "89", "90"];
const PLATE_ITEMS = ["82", "83", "84"];
const FALAFEL_PLATE = ["94"];
const ALL_CONFIGURED = [...WRAP_ITEMS, ...PLATE_ITEMS, ...FALAFEL_PLATE];

const MEAT_OPTIONS = [
  { name: "Kalbfleisch", price: 0 },
  { name: "Hähnchenfleisch", price: 0 }
];

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

const PAID_EXTRAS = [
  { name: "Extra Fleisch", price: 1.5 },
  { name: "Weißkäse", price: 0.5 }
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

async function upsertAddOnGroup(itemId, suffix, groupName, options, maxSelect = 99) {
  const groupId = `extra-${BRANCH_ID}-${itemId}-${suffix}`;
  await prisma.addOnGroup.upsert({
    where: { id: groupId },
    update: { name: groupName, required: false, minSelect: 0, maxSelect },
    create: {
      id: groupId,
      name: groupName,
      itemId,
      required: false,
      minSelect: 0,
      maxSelect
    }
  });

  for (const [i, opt] of options.entries()) {
    const id = `${groupId}-${i}`;
    await prisma.addOn.upsert({
      where: { id },
      update: { name: opt.name, price: opt.price ?? 0 },
      create: { id, name: opt.name, price: opt.price ?? 0, groupId }
    });
  }
}

async function configureWrapItem(itemId, itemNumber, name) {
  await clearItemOptions(itemId);
  await upsertVariantChoiceGroup(itemId, "fleisch", "Fleisch", MEAT_OPTIONS);
  await upsertVariantChoiceGroup(itemId, "sauce", "Sauce", SAUCE_OPTIONS);
  await upsertAddOnGroup(itemId, "paid", "Extras", PAID_EXTRAS, 2);
  console.log(`  ✓ #${itemNumber} ${name} (wrap)`);
}

async function configurePlateItem(itemId, itemNumber, name) {
  await clearItemOptions(itemId);
  await upsertVariantChoiceGroup(itemId, "fleisch", "Fleisch", MEAT_OPTIONS);
  await upsertVariantChoiceGroup(itemId, "beilage", "Beilage", SIDE_OPTIONS);
  await upsertVariantChoiceGroup(itemId, "salat-sauce", "Salatsoße", SAUCE_OPTIONS);
  await upsertAddOnGroup(itemId, "paid", "Extras", PAID_EXTRAS, 2);
  console.log(`  ✓ #${itemNumber} ${name} (plate)`);
}

async function configureFalafelPlate(itemId, itemNumber, name) {
  await clearItemOptions(itemId);
  await upsertVariantChoiceGroup(itemId, "salat-sauce", "Salatsoße", SAUCE_OPTIONS);
  console.log(`  ✓ #${itemNumber} ${name} (falafel plate, Pommes included)`);
}

async function main() {
  const entries = await prisma.branchMenuItem.findMany({
    where: {
      branchId: BRANCH_ID,
      menuItem: { itemNumber: { in: ALL_CONFIGURED } }
    },
    include: { menuItem: true },
    orderBy: { menuItem: { itemNumber: "asc" } }
  });

  const byNumber = new Map(entries.map((e) => [String(e.menuItem.itemNumber), e.menuItem]));

  for (const num of ALL_CONFIGURED) {
    const item = byNumber.get(num);
    if (!item) {
      console.warn(`  ! Item #${num} not found on Straelen menu`);
      continue;
    }

    if (WRAP_ITEMS.includes(num)) {
      await configureWrapItem(item.id, num, item.name);
    } else if (PLATE_ITEMS.includes(num)) {
      await configurePlateItem(item.id, num, item.name);
    } else if (FALAFEL_PLATE.includes(num)) {
      await configureFalafelPlate(item.id, num, item.name);
    }
  }

  console.log("\nDone. Menu cache will refresh within ~30 min, or redeploy / bust Redis on Render.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
