import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const row = await prisma.branchConfig.findUnique({
  where: { branchId: "concordia-straelen" }
});
const cfg = row?.configJson ?? {};
console.log(JSON.stringify(cfg, null, 2));
await prisma.$disconnect();
