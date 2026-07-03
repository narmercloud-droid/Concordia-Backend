-- AlterTable
ALTER TABLE "Order" ADD COLUMN "termsAcceptedAt" TIMESTAMP(3),
ADD COLUMN "confirmationEmailSentAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "BranchGiftCard" ADD COLUMN "termsAcceptedAt" TIMESTAMP(3);
