import { PrismaClient } from '@prisma/client';
import pg from 'pg';

const prisma = new PrismaClient();
const { Client } = pg;

const oldDb = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function migrateMenuItems() {
  await oldDb.connect();
  console.log("Connected to old SQL database");

  const result = await oldDb.query(`SELECT * FROM menu_items`);
  const oldItems = result.rows;

  console.log(`Found ${oldItems.length} menu items to migrate`);

  for (const item of oldItems) {
    const category = await prisma.category.upsert({
      where: { name: item.category },
      update: {},
      create: { name: item.category },
    });

    await prisma.menuItem.upsert({
      where: { id: item.id },
      update: {
        name: item.name,
        description: item.description,
        price: item.price,
        imageUrl: item.image_url,
        categoryId: category.id,
      },
      create: {
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        imageUrl: item.image_url,
        categoryId: category.id,
      },
    });

    console.log(`Migrated: ${item.name}`);
  }

  console.log("Migration complete!");
  await oldDb.end();
  await prisma.$disconnect();
}

migrateMenuItems().catch((err) => {
  console.error(err);
  process.exit(1);
});
