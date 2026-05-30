-- AlterTable
ALTER TABLE "PrinterQueue" ADD COLUMN     "durationMs" INTEGER,
ADD COLUMN     "printedAt" TIMESTAMP(3);
