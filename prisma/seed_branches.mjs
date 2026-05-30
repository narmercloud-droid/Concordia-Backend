import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.branch.upsert({
    where: { id: "test-branch-1" },
    update: {
      name: "Test Branch",
      printerType: "virtual"
    },
    create: {
      id: "test-branch-1",
      name: "Test Branch",
      printerType: "virtual"
    }
  });

  console.log("✓ Branch seeded successfully!");
}

main()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
