import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  const categoryId = randomUUID();
  const itemId = randomUUID();

  // Variants are not supported by the current Prisma schema.
  // This seed creates one category and one menu item for the menu list.

  // Create a minimal menu seed. Do not purge all existing data here,
  // because the current schema contains many related tables and the
  // backend only requires one seeded menu item to unblock the order flow.

  const category = await prisma.category.create({
    data: {
      id: categoryId,
      name: "Pizza",
      position: 1,
      description: "Popular pizza items",
    },
  });

  const item = await prisma.menuItem.create({
    data: {
      id: itemId,
      name: "Margherita Pizza",
      description: "Classic pizza with tomato sauce, mozzarella, and basil.",
      price: 12.5,
      tags: ["vegetarian", "popular"],
      stock: 50,
      lowStockThreshold: 5,
      autoDisable: false,
      kitchen: "A",
      categoryId: category.id,
    },
  });

  console.log("Seed complete:", {
    category: { id: category.id, name: category.name },
    item: { id: item.id, name: item.name, price: item.price },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
