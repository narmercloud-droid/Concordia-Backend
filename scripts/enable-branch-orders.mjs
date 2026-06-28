import { PrismaClient } from "@prisma/client";

const branchId = process.argv[2] || "concordia-straelen";
const prisma = new PrismaClient();

const row = await prisma.branchConfig.findUnique({ where: { branchId } });
const config = { ...(row?.configJson ?? {}) };
console.log("Before:", { status: config.status, ordersPaused: config.ordersPaused });

config.status = "live";
config.ordersPaused = false;

await prisma.branchConfig.update({
  where: { branchId },
  data: { configJson: config }
});

console.log("After:", { status: config.status, ordersPaused: config.ordersPaused });
await prisma.$disconnect();
