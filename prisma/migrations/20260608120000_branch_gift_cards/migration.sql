ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "giftCardId" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "giftCardAmount" DOUBLE PRECISION;

CREATE TABLE IF NOT EXISTS "BranchGiftCard" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "initialAmount" DECIMAL(10,2) NOT NULL,
    "balance" DECIMAL(10,2) NOT NULL,
    "purchaserName" TEXT,
    "purchaserEmail" TEXT,
    "purchaserPhone" TEXT,
    "recipientName" TEXT,
    "message" TEXT,
    "paymentMethod" TEXT,
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "paypalOrderId" TEXT,
    "paypalCaptureId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BranchGiftCard_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "BranchGiftCard_code_key" ON "BranchGiftCard"("code");
CREATE INDEX IF NOT EXISTS "BranchGiftCard_branchId_idx" ON "BranchGiftCard"("branchId");
CREATE INDEX IF NOT EXISTS "BranchGiftCard_branchId_paymentStatus_idx" ON "BranchGiftCard"("branchId", "paymentStatus");
