-- Branch-scoped customer database (one CRM per branch)
ALTER TABLE "MarketingLead" RENAME TO "BranchCustomer";

UPDATE "BranchCustomer" SET "branchId" = 'concordia-kempen' WHERE "branchId" IS NULL;

ALTER TABLE "BranchCustomer" DROP CONSTRAINT IF EXISTS "MarketingLead_pkey";
ALTER TABLE "BranchCustomer" ADD CONSTRAINT "BranchCustomer_pkey" PRIMARY KEY ("id");

DROP INDEX IF EXISTS "MarketingLead_phone_key";

ALTER TABLE "BranchCustomer" ALTER COLUMN "branchId" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "BranchCustomer_branchId_phone_key" ON "BranchCustomer"("branchId", "phone");

ALTER TABLE "BranchCustomer" ADD COLUMN IF NOT EXISTS "birthday" DATE;
ALTER TABLE "BranchCustomer" ADD COLUMN IF NOT EXISTS "preferredChannel" TEXT;
ALTER TABLE "BranchCustomer" ADD COLUMN IF NOT EXISTS "orderCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "BranchCustomer" ADD COLUMN IF NOT EXISTS "firstOrderAt" TIMESTAMP(3);
ALTER TABLE "BranchCustomer" ADD COLUMN IF NOT EXISTS "winBackOfferSentAt" TIMESTAMP(3);
ALTER TABLE "BranchCustomer" ADD COLUMN IF NOT EXISTS "birthdayOfferSentAt" TIMESTAMP(3);

-- Backfill order stats from existing orders
UPDATE "BranchCustomer" bc SET
  "orderCount" = stats.cnt,
  "firstOrderAt" = stats.first_at,
  "lastOrderAt" = COALESCE(bc."lastOrderAt", stats.last_at)
FROM (
  SELECT "branchId", "customerPhone" AS phone,
    COUNT(*)::int AS cnt,
    MIN("createdAt") AS first_at,
    MAX("createdAt") AS last_at
  FROM "Order"
  WHERE "customerPhone" IS NOT NULL AND TRIM("customerPhone") <> ''
  GROUP BY "branchId", "customerPhone"
) stats
WHERE bc."branchId" = stats."branchId" AND bc.phone = stats.phone;
