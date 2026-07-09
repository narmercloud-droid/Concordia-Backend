/**
 * Fix Pizza Margherita descriptions that incorrectly say no extras are allowed.
 * Usage: node scripts/fix-margherita-description.mjs
 */
import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

function cleanDescription(description) {
  if (!description) return null;
  const next = description
    .replace(/\(keine weitere zutat m[oö]glich\)/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  return next === description ? null : next;
}

try {
  const items = await prisma.menuItem.findMany({
    where: {
      description: { contains: "keine weitere Zutat", mode: "insensitive" }
    },
    select: { id: true, name: true, description: true }
  });

  let updated = 0;
  const branchIds = new Set();

  for (const item of items) {
    const next = cleanDescription(item.description);
    if (!next) continue;
    await prisma.menuItem.update({
      where: { id: item.id },
      data: { description: next }
    });
    const links = await prisma.branchMenuItem.findMany({
      where: { menuItemId: item.id },
      select: { branchId: true }
    });
    for (const link of links) branchIds.add(link.branchId);
    console.log(`Updated #${item.id} ${item.name}`);
    updated += 1;
  }

  const redisUrl = String(process.env.REDIS_URL || "").trim();
  if (redisUrl.startsWith("redis://")) {
    const redis = createClient({ url: redisUrl });
    try {
      await redis.connect();
      await redis.del("customer:branches:v1", "customer:branches:v2");
      for (const branchId of branchIds) {
        const keys = await redis.keys(`customer:menu:${branchId}:*`);
        if (keys.length) await redis.del(keys);
        const itemKeys = await redis.keys(`customer:item:${branchId}:*`);
        if (itemKeys.length) await redis.del(itemKeys);
      }
      console.log("Cleared menu cache keys");
    } catch (err) {
      console.warn("Could not clear Redis cache:", err?.message ?? err);
    } finally {
      try {
        await redis.quit();
      } catch {
        // ignore
      }
    }
  }

  console.log(updated ? `Done. Updated ${updated} item(s).` : "No descriptions needed updating.");
} finally {
  await prisma.$disconnect();
}
