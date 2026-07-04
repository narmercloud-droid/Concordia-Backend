/**
 * Enforce: 10% website discount + free drink from €35 on all branches; no promo/coupon codes.
 * Run: node scripts/apply-discount-policy.mjs
 */
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";

dotenv.config();
const prisma = new PrismaClient();
const BRANCHES_CACHE_KEY = "customer:branches:v1";

async function bustBranchListCache() {
  const redisUrl = String(process.env.REDIS_URL || "").trim();
  if (!redisUrl.startsWith("redis://")) {
    console.log("Redis not configured — skip remote branch cache bust.");
    return;
  }
  const redis = createClient({ url: redisUrl });
  try {
    await redis.connect();
    await redis.del(BRANCHES_CACHE_KEY);
    console.log(`Cleared Redis key ${BRANCHES_CACHE_KEY}`);
  } catch (err) {
    console.warn("Could not clear Redis branch cache:", err?.message ?? err);
    console.warn("Restart the API or save platform settings in admin to refresh live caches.");
  } finally {
    try {
      await redis.quit();
    } catch {
      // ignore
    }
  }
}

const FREE_DRINK_MESSAGE =
  "Ab 35 € Bestellwert erhalten Sie ein Getränk gratis (0,33 l Softdrink oder 0,5 l Durstlöscher).";

async function main() {
  const platformRow = await prisma.platformConfig.findUnique({ where: { id: "default" } });
  const currentPlatform = (platformRow?.configJson ?? {}) ;
  const nextPlatform = {
    ...currentPlatform,
    websiteOrderDiscountPct: 10,
    freeDrinkCheckoutEnabled: true,
    showFreeDrinkCheckout: true,
    showLoyaltyCheckout: false
  };

  await prisma.platformConfig.upsert({
    where: { id: "default" },
    update: { configJson: nextPlatform },
    create: { id: "default", configJson: nextPlatform }
  });
  console.log("Platform config updated:", JSON.stringify(nextPlatform, null, 2));

  const branches = await prisma.branch.findMany({
    include: { BranchConfig: true }
  });

  for (const branch of branches) {
    const existing = (branch.BranchConfig?.configJson ?? {});
    const promotions = (existing.promotions ?? {});
    const configJson = {
      ...existing,
      promotions: {
        ...promotions,
        websiteDiscountEnabled: true,
        freeDrinkEnabled: true,
        freeDrinkMinOrder: 35,
        freeDrinkMessage: FREE_DRINK_MESSAGE
      }
    };

    await prisma.branchConfig.upsert({
      where: { branchId: branch.id },
      update: { configJson, version: { increment: 1 } },
      create: { id: `config-${branch.id}`, branchId: branch.id, configJson }
    });
    console.log(`Branch ${branch.id}: 10% discount ON, free drink from €35 ON`);
  }

  const promoResult = await prisma.promoCode.updateMany({
    data: { isActive: false }
  });
  console.log(`Deactivated ${promoResult.count} PromoCode row(s)`);

  const campaignResult = await prisma.couponCampaign.updateMany({
    data: { isActive: false }
  });
  console.log(`Deactivated ${campaignResult.count} CouponCampaign row(s)`);

  const activePromos = await prisma.promoCode.findMany({ select: { code: true, isActive: true } });
  const activeCampaigns = await prisma.couponCampaign.findMany({
    select: { id: true, title: true, isActive: true, branchId: true }
  });
  console.log("\nRemaining promo codes:", activePromos);
  console.log("Remaining campaigns:", activeCampaigns);

  await bustBranchListCache();
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
