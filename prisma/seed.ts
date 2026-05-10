import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  const raw = fs.readFileSync("prisma/data.json", "utf-8");
  const data = JSON.parse(raw);

  // Clear tables in correct order
  await prisma.dealItem.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.relationVariant.deleteMany();
  await prisma.relationTopping.deleteMany();
  await prisma.relationExtra.deleteMany();
  await prisma.relation.deleteMany();
  await prisma.extra.deleteMany();
  await prisma.topping.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.item.deleteMany();
  await prisma.category.deleteMany();

  console.log("🧹 Old data cleared.");

  // Insert categories
  await prisma.category.createMany({
    data: data.categories,
  });
  console.log("📁 Categories inserted.");

  // Insert items
  await prisma.item.createMany({
    data: data.items,
  });
  console.log("🍕 Items inserted.");

  // Insert variants
  await prisma.variant.createMany({
    data: data.variants,
  });
  console.log("🔢 Variants inserted.");

  // Insert toppings
  await prisma.topping.createMany({
    data: data.toppings,
  });
  console.log("🥗 Toppings inserted.");

  // Insert extras
  await prisma.extra.createMany({
    data: data.extras,
  });
  console.log("➕ Extras inserted.");

  // Insert relations
  for (const rel of data.relations) {
    const created = await prisma.relation.create({
      data: {
        item_id: rel.item_id,
        category_id: rel.category_id,
      },
    });

    // Variants
    for (const v of rel.variant_ids) {
      await prisma.relationVariant.create({
        data: {
          relation_id: created.id,
          variant_id: v,
        },
      });
    }

    // Toppings
    for (const t of rel.topping_ids) {
      await prisma.relationTopping.create({
        data: {
          relation_id: created.id,
          topping_id: t,
        },
      });
    }

    // Extras
    for (const e of rel.extra_ids) {
      await prisma.relationExtra.create({
        data: {
          relation_id: created.id,
          extra_id: e,
        },
      });
    }
  }
  console.log("🔗 Relations inserted.");

  // Insert deals
  for (const deal of data.deals) {
    const createdDeal = await prisma.deal.create({
      data: {
        deal_id: deal.deal_id,
        admin_name_en: deal.admin_name_en,
        customer_name_de: deal.customer_name_de,
        description_de: deal.description_de,
        visible: deal.visible,
        available: deal.available,
        sort_order: deal.sort_order,
      },
    });

    for (const itemId of deal.items_included) {
      await prisma.dealItem.create({
        data: {
          deal_id: createdDeal.deal_id,
          item_id: itemId,
        },
      });
    }
  }
  console.log("💼 Deals inserted.");

  console.log("🌱 Database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
