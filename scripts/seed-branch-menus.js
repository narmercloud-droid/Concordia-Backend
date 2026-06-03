import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Seed script: branch-specific menus
 * - Idempotent (find-or-create / update)
 * - Uses ESM imports
 *
 * NOTE: True Prisma `upsert` requires a unique scalar field in the `where` clause.
 * Some models in this schema do not expose a convenient unique field other than `id`.
 * To remain safe and idempotent across runs, this script uses `findFirst` + `update` or `create` logic.
 * You can replace these with `upsert` if you later add unique constraints.
 */

async function ensureMenuItem(base) {
  // Try to locate by name (assumes name uniqueness in practice).
  const existing = await prisma.menuItem.findFirst({ where: { name: base.name } });
  if (existing) {
    return await prisma.menuItem.update({ where: { id: existing.id }, data: base });
  }
  return await prisma.menuItem.create({ data: base });
}

async function ensureBranchCategory(branchId, name) {
  const existing = await prisma.branchCategory.findFirst({ where: { branchId, name } });
  if (existing) return existing;
  return await prisma.branchCategory.create({ data: { branchId, name } });
}

async function ensureBranchMenuItem(branchId, menuItemId, payload) {
  const existing = await prisma.branchMenuItem.findFirst({ where: { branchId, menuItemId } });
  if (existing) {
    return await prisma.branchMenuItem.update({ where: { id: existing.id }, data: payload });
  }
  return await prisma.branchMenuItem.create({ data: { branchId, menuItemId, ...payload } });
}

async function ensureMenuItemExtra(menuItemId, extra) {
  const existing = await prisma.menuItemExtra.findFirst({ where: { menuItemId, name: extra.name } });
  if (existing) return await prisma.menuItemExtra.update({ where: { id: existing.id }, data: extra });
  return await prisma.menuItemExtra.create({ data: { menuItemId, ...extra } });
}

async function ensureMenuItemNote(menuItemId, note) {
  const existing = await prisma.menuItemNote.findFirst({ where: { menuItemId, text: note.text } });
  if (existing) return await prisma.menuItemNote.update({ where: { id: existing.id }, data: note });
  return await prisma.menuItemNote.create({ data: { menuItemId, ...note } });
}

async function main() {
  console.log('Loading branches...');
  const branches = await prisma.branch.findMany();
  console.log(`Found ${branches.length} branches`);

  // === Define global base MenuItems ===
  // Edit or extend this array with your real catalog items.
  const baseMenuItems = [
    { name: 'Classic Burger', description: 'Beef patty with lettuce and tomato', baseImage: null, basePrice: 9.99 },
    { name: 'Fries', description: 'Crispy salted fries', baseImage: null, basePrice: 3.5 },
  ];

  // === Define per-item extras and notes (global) ===
  const extrasByName = {
    'Classic Burger': [
      { name: 'Extra Cheese', price: 1.0 },
      { name: 'Bacon', price: 1.5 },
    ],
    Fries: [
      { name: 'Large Size', price: 1.0 },
    ],
  };

  const notesByName = {
    'Classic Burger': [
      { text: 'Contains gluten' },
    ],
    Fries: [
      { text: 'May contain traces of allergens' },
    ],
  };

  // === Create or update global MenuItems ===
  const createdMenuItems = {};
  for (const base of baseMenuItems) {
    const created = await ensureMenuItem({
      name: base.name,
      description: base.description ?? null,
      baseImage: base.baseImage ?? null,
      basePrice: base.basePrice ?? null,
    });
    createdMenuItems[created.name] = created;
    console.log(`Ensured MenuItem: ${created.name} (id=${created.id})`);
  }

  // === Create extras & notes for menu items globally ===
  for (const [name, extras] of Object.entries(extrasByName)) {
    const menuItem = createdMenuItems[name];
    if (!menuItem) continue;
    for (const extra of extras) {
      await ensureMenuItemExtra(menuItem.id, { name: extra.name, price: extra.price ?? null });
    }
  }

  for (const [name, notes] of Object.entries(notesByName)) {
    const menuItem = createdMenuItems[name];
    if (!menuItem) continue;
    for (const note of notes) {
      await ensureMenuItemNote(menuItem.id, { text: note.text });
    }
  }

  // === For each branch, create categories and branch-specific menu entries ===
  for (const branch of branches) {
    console.log(`Seeding branch ${branch.id} (${branch.name ?? 'unknown name'})`);

    // Example categories per branch — adjust as needed or derive from data
    const categories = ['Main', 'Sides', 'Drinks'];
    const branchCategories = {};
    for (const cat of categories) {
      const createdCat = await ensureBranchCategory(branch.id, cat);
      branchCategories[cat] = createdCat;
    }

    // For each global menu item, create a branch-specific entry
    for (const created of Object.values(createdMenuItems)) {
      // Sample branch-specific overrides — adapt as needed
      const override = {
        price: created.basePrice != null ? created.basePrice + 0.0 : null,
        description: `${created.description ?? ''} (from branch ${branch.id})`,
        imageUrl: null,
        isAvailable: true,
      };

      // Choose category mapping (simple heuristic)
      const categoryName = created.name.toLowerCase().includes('fries') ? 'Sides' : 'Main';
      const category = branchCategories[categoryName] ?? null;

      const payload = {
        price: override.price,
        description: override.description,
        imageUrl: override.imageUrl,
        isAvailable: override.isAvailable,
        categoryId: category ? category.id : null,
      };

      await ensureBranchMenuItem(branch.id, created.id, payload);
    }
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
