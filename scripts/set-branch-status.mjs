/**
 * Update a branch status in BranchConfig.configJson.
 * Usage: node scripts/set-branch-status.mjs <branchId> <live|coming_soon>
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const branchId = process.argv[2];
const status = process.argv[3];

if (!branchId || !["live", "coming_soon"].includes(status)) {
  console.error("Usage: node scripts/set-branch-status.mjs <branchId> <live|coming_soon>");
  process.exit(1);
}

const row = await prisma.branchConfig.findUnique({ where: { branchId } });
if (!row) {
  console.error(`No BranchConfig for ${branchId}`);
  process.exit(1);
}

const configJson = {
  ...(row.configJson ?? {}),
  status
};

await prisma.branchConfig.update({
  where: { branchId },
  data: { configJson }
});

console.log(`Updated ${branchId} → status: ${status}`);
await prisma.$disconnect();
