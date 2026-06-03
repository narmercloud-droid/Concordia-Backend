import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database (full restaurant)...");

  // Branch (ensure seed branch exists)
  const branch = await prisma.branch.upsert({
    where: { id: "branch-001" },
    update: {},
    create: {
      id: "branch-001",
      name: "Test Branch",
      printerType: "network",
      printerUrl: "http://localhost",
      avgPrepTimeBaseline: 10,
      currentLoadLevel: 0
    }
  });

  // Customer
  await prisma.customer.upsert({
    where: { id: "test-customer" },
    update: {},
    create: {
      id: "test-customer",
      name: "Test Customer",
      email: "test@example.com",
      phone: "+10000000000",
      phoneNumber: "+10000000000",
      loginToken: null,
      loginTokenExpires: null,
      marketingEmail: false,
      marketingSMS: false,
      marketingWhatsApp: false,
      marketingConsent: false,
      marketingConsentAt: null,
      loyaltyPoints: 0,
      lifetimePoints: 0,
      loyaltyTier: "bronze"
    }
  });

  // Categories
  const categories = [
    { name: "Burgers", description: "Juicy grilled burgers" },
    { name: "Drinks", description: "Refreshing beverages" },
    { name: "Desserts", description: "Sweet treats" }
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: { description: cat.description },
      create: {
        name: cat.name,
        description: cat.description
      }
    });
  }

  // Menu items (use explicit IDs for deterministic upserts)
  const items = [
    { id: 1001, name: "Classic Burger", description: "Beef patty, lettuce, tomato", basePrice: 8.5, category: "Burgers" },
    { id: 1002, name: "Cheeseburger", description: "Beef patty with cheese", basePrice: 9.5, category: "Burgers" },
    { id: 2001, name: "Coke", description: "330ml can", basePrice: 2.0, category: "Drinks" },
    { id: 3001, name: "Chocolate Cake", description: "Rich chocolate slice", basePrice: 4.5, category: "Desserts" }
  ];

  for (const it of items) {
    await prisma.menuItem.upsert({
      where: { id: it.id },
      update: { name: it.name, description: it.description, basePrice: it.basePrice },
      create: {
        id: it.id,
        name: it.name,
        description: it.description,
        basePrice: it.basePrice
      }
    });
  }

  // Variant groups and variants (Size: Small/Medium/Large) for burger items
  const burgerItemIds = [1001, 1002];
  for (const menuItemId of burgerItemIds) {
    const groupId = `size-group-${menuItemId}`;
    const variantGroup = await prisma.variantGroup.upsert({
      where: { id: groupId },
      update: {},
      create: {
        id: groupId,
        name: "Size",
        itemId: menuItemId
      }
    });

    const sizes = [
      { id: `v-small-${menuItemId}`, name: "Small", price: 0 },
      { id: `v-medium-${menuItemId}`, name: "Medium", price: 1.5 },
      { id: `v-large-${menuItemId}`, name: "Large", price: 3.0 }
    ];

    for (const s of sizes) {
      await prisma.variant.upsert({
        where: { id: s.id },
        update: { name: s.name, price: s.price, groupId: variantGroup.id },
        create: { id: s.id, name: s.name, price: s.price, groupId: variantGroup.id }
      });
    }
  }

  // Add-on groups and add-ons (global style attached to burger items)
  for (const menuItemId of burgerItemIds) {
    const addOnGroupId = `addons-${menuItemId}`;
    const addOnGroup = await prisma.addOnGroup.upsert({
      where: { id: addOnGroupId },
      update: {},
      create: {
        id: addOnGroupId,
        name: "Extras",
        itemId: menuItemId
      }
    });

    const addons = [
      { id: `a-cheese-${menuItemId}`, name: "Cheese", price: 1.0 },
      { id: `a-bacon-${menuItemId}`, name: "Bacon", price: 1.5 },
      { id: `a-sauce-${menuItemId}`, name: "Extra Sauce", price: 0.5 }
    ];

    for (const a of addons) {
      await prisma.addOn.upsert({
        where: { id: a.id },
        update: { name: a.name, price: a.price, groupId: addOnGroup.id },
        create: { id: a.id, name: a.name, price: a.price, groupId: addOnGroup.id }
      });
    }
  }

  // Branch pricing and availability for each menu item
  const branchId = branch.id;
  for (const it of items) {
    const pricingId = `${branchId}-${it.id}-pricing`;
    await prisma.branchItemPricing.upsert({
      where: { id: pricingId },
      update: { price: it.basePrice },
      create: { id: pricingId, branchId, menuItemId: it.id, price: it.basePrice }
    });

    const availabilityId = `${branchId}-${it.id}-avail`;
    await prisma.branchItemAvailability.upsert({
      where: { id: availabilityId },
      update: { isAvailable: true },
      create: { id: availabilityId, branchId, menuItemId: it.id, isAvailable: true }
    });
  }

  console.log("🌱 Full restaurant seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
