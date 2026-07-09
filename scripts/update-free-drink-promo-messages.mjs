/**
 * Update Kempen + Straelen free-drink promo copy to 1.0 l soft drinks / 0.5 l Durstlöscher.
 * Usage: node scripts/update-free-drink-promo-messages.mjs
 */
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const BRANCH_IDS = ["concordia-kempen", "concordia-straelen"];
const FREE_DRINK_MESSAGE =
  "Ab 35 € Bestellwert erhalten Sie ein Getränk gratis (1,0 l Softdrink oder 0,5 l Durstlöscher).";

const prisma = new PrismaClient();

try {
  for (const branchId of BRANCH_IDS) {
    const existing = await prisma.branchConfig.findUnique({ where: { branchId } });
    const current = existing?.configJson ?? {};
    const promotions = current.promotions ?? {};

    const configJson = {
      ...current,
      promotions: {
        ...promotions,
        freeDrinkMessage: FREE_DRINK_MESSAGE
      }
    };

    await prisma.branchConfig.upsert({
      where: { branchId },
      update: { configJson, version: { increment: 1 } },
      create: {
        id: randomUUID(),
        branchId,
        configJson
      }
    });

    console.log(`Updated free drink message for ${branchId}`);
  }

  const redisUrl = String(process.env.REDIS_URL || "").trim();
  if (redisUrl.startsWith("redis://")) {
    const redis = createClient({ url: redisUrl });
    try {
      await redis.connect();
      await redis.del("customer:branches:v1", "customer:branches:v2");
      console.log("Cleared branch list cache keys");
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
} finally {
  await prisma.$disconnect();
}
