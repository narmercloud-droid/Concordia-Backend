import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const prisma = new PrismaClient();

const branchIds = process.argv.slice(2);
const targets =
  branchIds.length > 0 ? branchIds : ["concordia-kempen", "concordia-straelen"];

for (const branchId of targets) {
  const row = await prisma.branchConfig.findUnique({ where: { branchId } });
  if (!row) {
    console.log(`${branchId}: no BranchConfig — skipped`);
    continue;
  }

  const config = row.configJson ?? {};
  const mode = String(config.deliveryMode ?? "");
  const areas = Array.isArray(config.deliveryAreas) ? config.deliveryAreas : [];

  if (mode !== "radius") {
    console.log(`${branchId}: deliveryMode=${mode || "unset"} — skipped (not radius)`);
    continue;
  }

  if (!areas.length) {
    console.log(`${branchId}: radius mode, deliveryAreas already empty`);
    continue;
  }

  const next = { ...config, deliveryAreas: [] };
  await prisma.branchConfig.update({
    where: { branchId },
    data: { configJson: next, version: { increment: 1 } }
  });

  console.log(`${branchId}: cleared ${areas.length} legacy postcode entries`);
}

await prisma.$disconnect();
