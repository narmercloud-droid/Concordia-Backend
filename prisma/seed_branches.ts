import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

async function main() {
  await prisma.branch.upsert({
    where: { id: "test-branch-1" },
    update: {},
    create: {
      id: "test-branch-1",
      name: "Test Branch",
      printerType: "virtual"
    }
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
