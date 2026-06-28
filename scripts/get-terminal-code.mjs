import { PrismaClient } from "@prisma/client";

const branchId = process.argv[2] || "concordia-straelen";
const prisma = new PrismaClient();

const config = await prisma.branchConfig.findUnique({
  where: { branchId },
  include: { Branch: true }
});

const json = config?.configJson ?? {};
console.log(JSON.stringify({
  branchId,
  branchName: config?.Branch?.name ?? null,
  terminalCode: json.terminalCode ?? json.branchCode ?? null
}, null, 2));

await prisma.$disconnect();
