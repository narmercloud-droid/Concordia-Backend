-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "kitchenStatus" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "kitchenUpdatedAt" TIMESTAMP(3);
