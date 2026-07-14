-- AlterTable
ALTER TABLE "PromoCode" ADD COLUMN "branchId" TEXT;

-- CreateIndex
CREATE INDEX "PromoCode_branchId_isActive_idx" ON "PromoCode"("branchId", "isActive");
