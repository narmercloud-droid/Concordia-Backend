-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "estimatedDriverTime" INTEGER,
ADD COLUMN     "estimatedPrepTime" INTEGER,
ADD COLUMN     "estimatedTotalTime" INTEGER,
ADD COLUMN     "etaDeliveredAt" TIMESTAMP(3),
ADD COLUMN     "etaReadyAt" TIMESTAMP(3);
