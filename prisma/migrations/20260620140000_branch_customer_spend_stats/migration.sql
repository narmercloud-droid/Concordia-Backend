-- AlterTable
ALTER TABLE "BranchCustomer" ADD COLUMN "totalSpent" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "BranchCustomer" ADD COLUMN "totalSaved" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- Backfill spend/savings and order counts from historical orders
UPDATE "BranchCustomer" bc
SET
  "orderCount" = agg.order_count,
  "totalSpent" = agg.total_spent,
  "totalSaved" = agg.total_saved,
  "firstOrderAt" = COALESCE(bc."firstOrderAt", agg.first_order_at),
  "lastOrderAt" = COALESCE(bc."lastOrderAt", agg.last_order_at)
FROM (
  SELECT
    "branchId",
    TRIM("customerPhone") AS phone,
    COUNT(*)::integer AS order_count,
    COALESCE(SUM(COALESCE("orderTotal", 0)), 0) AS total_spent,
    COALESCE(
      SUM(COALESCE("discount", 0) + COALESCE("giftCardAmount", 0)),
      0
    ) AS total_saved,
    MIN("createdAt") AS first_order_at,
    MAX("createdAt") AS last_order_at
  FROM "Order"
  WHERE "customerPhone" IS NOT NULL AND TRIM("customerPhone") <> ''
  GROUP BY "branchId", TRIM("customerPhone")
) agg
WHERE bc."branchId" = agg."branchId" AND bc.phone = agg.phone;

-- Create branch customer rows for phones that ordered but were never synced
INSERT INTO "BranchCustomer" (
  "id",
  "branchId",
  "phone",
  "name",
  "email",
  "marketingEmail",
  "marketingSMS",
  "marketingWhatsApp",
  "orderCount",
  "totalSpent",
  "totalSaved",
  "firstOrderAt",
  "lastOrderAt",
  "createdAt",
  "updatedAt"
)
SELECT
  gen_random_uuid()::text,
  agg."branchId",
  agg.phone,
  agg.name,
  agg.email,
  agg.marketing_email,
  agg.marketing_sms,
  agg.marketing_whatsapp,
  agg.order_count,
  agg.total_spent,
  agg.total_saved,
  agg.first_order_at,
  agg.last_order_at,
  agg.first_order_at,
  NOW()
FROM (
  SELECT
    "branchId",
    TRIM("customerPhone") AS phone,
    MAX("customerName") AS name,
    MAX("customerEmail") AS email,
    BOOL_OR("marketingEmail") AS marketing_email,
    BOOL_OR("marketingSMS") AS marketing_sms,
    BOOL_OR("marketingWhatsApp") AS marketing_whatsapp,
    COUNT(*)::integer AS order_count,
    COALESCE(SUM(COALESCE("orderTotal", 0)), 0) AS total_spent,
    COALESCE(
      SUM(COALESCE("discount", 0) + COALESCE("giftCardAmount", 0)),
      0
    ) AS total_saved,
    MIN("createdAt") AS first_order_at,
    MAX("createdAt") AS last_order_at
  FROM "Order"
  WHERE "customerPhone" IS NOT NULL AND TRIM("customerPhone") <> ''
  GROUP BY "branchId", TRIM("customerPhone")
) agg
WHERE NOT EXISTS (
  SELECT 1
  FROM "BranchCustomer" bc
  WHERE bc."branchId" = agg."branchId" AND bc.phone = agg.phone
);
