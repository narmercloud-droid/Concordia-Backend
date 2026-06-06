-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "MenuItem" ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true;
