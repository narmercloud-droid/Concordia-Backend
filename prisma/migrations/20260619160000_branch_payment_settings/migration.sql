-- CreateTable
CREATE TABLE "BranchPaymentSettings" (
    "branchId" TEXT NOT NULL,
    "stripeAccountId" TEXT,
    "stripeChargesEnabled" BOOLEAN NOT NULL DEFAULT false,
    "stripeDetailsSubmitted" BOOLEAN NOT NULL DEFAULT false,
    "stripePayoutsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "cardEnabled" BOOLEAN NOT NULL DEFAULT true,
    "applePayEnabled" BOOLEAN NOT NULL DEFAULT true,
    "googlePayEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BranchPaymentSettings_pkey" PRIMARY KEY ("branchId")
);

-- AlterTable
ALTER TABLE "BranchGiftCard" ADD COLUMN IF NOT EXISTS "stripePaymentIntentId" TEXT;

-- AddForeignKey
ALTER TABLE "BranchPaymentSettings" ADD CONSTRAINT "BranchPaymentSettings_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
