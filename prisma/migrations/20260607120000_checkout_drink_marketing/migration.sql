-- Free drink choice + marketing consent on guest checkout orders
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "freeDrinkChoice" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "marketingEmail" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "marketingSMS" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "marketingWhatsApp" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "marketingConsentAt" TIMESTAMP(3);

CREATE TABLE IF NOT EXISTS "MarketingLead" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "branchId" TEXT,
    "marketingEmail" BOOLEAN NOT NULL DEFAULT false,
    "marketingSMS" BOOLEAN NOT NULL DEFAULT false,
    "marketingWhatsApp" BOOLEAN NOT NULL DEFAULT false,
    "consentAt" TIMESTAMP(3),
    "lastOrderAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketingLead_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "MarketingLead_phone_key" ON "MarketingLead"("phone");
