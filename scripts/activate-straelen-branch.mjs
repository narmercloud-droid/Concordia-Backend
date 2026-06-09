/**
 * Set concordia-straelen branch status to "live" (ordering enabled).
 * Clears Redis branch list cache so production API updates immediately.
 * Safe to re-run.
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";

const prisma = new PrismaClient();
const BRANCH_ID = "concordia-straelen";
const BRANCHES_CACHE_KEY = "customer:branches:v1";

async function main() {
  const branch = await prisma.branch.findUnique({
    where: { id: BRANCH_ID },
    include: { BranchConfig: true }
  });

  if (!branch) {
    throw new Error(`Branch not found: ${BRANCH_ID}`);
  }

  const existing = branch.BranchConfig?.configJson ?? {};
  const configJson = { ...existing, status: "live" };

  if (branch.BranchConfig) {
    await prisma.branchConfig.update({
      where: { branchId: BRANCH_ID },
      data: { configJson }
    });
  } else {
    await prisma.branchConfig.create({
      data: {
        id: `config-${BRANCH_ID}`,
        branchId: BRANCH_ID,
        configJson
      }
    });
  }

  const itemCount = await prisma.branchMenuItem.count({
    where: { branchId: BRANCH_ID }
  });

  const redisUrl = String(process.env.REDIS_URL || "").trim();
  if (redisUrl.startsWith("redis://")) {
    try {
      const redis = createClient({ url: redisUrl });
      await redis.connect();
      await redis.del(BRANCHES_CACHE_KEY);
      await redis.quit();
      console.log(`✓ Cleared Redis cache: ${BRANCHES_CACHE_KEY}`);
    } catch (err) {
      console.warn(
        `  Could not clear Redis (${err?.message ?? err}). Branch list cache may take up to 10 min to refresh on the API.`
      );
    }
  } else {
    console.log("  (No REDIS_URL — API cache may take up to 10 min to refresh)");
  }

  console.log(`✓ ${BRANCH_ID} is now LIVE`);
  console.log(`  Menu items: ${itemCount}`);
  console.log(`  Name: ${configJson.name ?? branch.name}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
