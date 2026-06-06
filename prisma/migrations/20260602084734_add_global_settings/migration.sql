/*
  Warnings:

  - The primary key for the `MenuItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `autoDisable` on the `MenuItem` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `MenuItem` table. All the data in the column will be lost.
  - You are about to drop the column `kitchen` on the `MenuItem` table. All the data in the column will be lost.
  - You are about to drop the column `lowStockThreshold` on the `MenuItem` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `MenuItem` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `MenuItem` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `MenuItem` table. All the data in the column will be lost.
  - The `id` column on the `MenuItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `itemId` on the `CartItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `itemId` on the `Favorite` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updatedAt` to the `MenuItem` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `itemId` on the `OrderItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `itemId` on the `PriceHistory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `itemId` on the `Relation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_itemId_fkey";

-- DropForeignKey
ALTER TABLE "MenuItem" DROP CONSTRAINT "MenuItem_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_itemId_fkey";

-- DropForeignKey
ALTER TABLE "PriceHistory" DROP CONSTRAINT "PriceHistory_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Relation" DROP CONSTRAINT "Relation_itemId_fkey";

-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "itemId",
ADD COLUMN     "itemId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Favorite" DROP COLUMN "itemId",
ADD COLUMN     "itemId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "MenuItem" DROP CONSTRAINT "MenuItem_pkey",
DROP COLUMN "autoDisable",
DROP COLUMN "categoryId",
DROP COLUMN "kitchen",
DROP COLUMN "lowStockThreshold",
DROP COLUMN "price",
DROP COLUMN "stock",
DROP COLUMN "tags",
ADD COLUMN     "baseImage" TEXT,
ADD COLUMN     "basePrice" DOUBLE PRECISION,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "MenuItem_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "itemId",
ADD COLUMN     "itemId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PriceHistory" DROP COLUMN "itemId",
ADD COLUMN     "itemId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Relation" DROP COLUMN "itemId",
ADD COLUMN     "itemId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "BranchMenuItem" (
    "id" SERIAL NOT NULL,
    "branchId" TEXT NOT NULL,
    "menuItemId" INTEGER NOT NULL,
    "price" DOUBLE PRECISION,
    "description" TEXT,
    "imageUrl" TEXT,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" INTEGER,

    CONSTRAINT "BranchMenuItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BranchCategory" (
    "id" SERIAL NOT NULL,
    "branchId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "BranchCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuItemExtra" (
    "id" SERIAL NOT NULL,
    "menuItemId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION,

    CONSTRAINT "MenuItemExtra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuItemNote" (
    "id" SERIAL NOT NULL,
    "menuItemId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "MenuItemNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlobalSettings" (
    "id" TEXT NOT NULL,
    "enableSms" BOOLEAN NOT NULL DEFAULT false,
    "enablePush" BOOLEAN NOT NULL DEFAULT false,
    "enableEmail" BOOLEAN NOT NULL DEFAULT false,
    "smsProvider" TEXT NOT NULL DEFAULT 'none',
    "pushProvider" TEXT NOT NULL DEFAULT 'none',
    "emailProvider" TEXT NOT NULL DEFAULT 'none',
    "notifyOrderPlaced" BOOLEAN NOT NULL DEFAULT true,
    "notifyOrderAccepted" BOOLEAN NOT NULL DEFAULT true,
    "notifyOutForDelivery" BOOLEAN NOT NULL DEFAULT true,
    "notifyDelivered" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "GlobalSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_customerId_itemId_key" ON "Favorite"("customerId", "itemId");

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceHistory" ADD CONSTRAINT "PriceHistory_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relation" ADD CONSTRAINT "Relation_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchMenuItem" ADD CONSTRAINT "BranchMenuItem_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchMenuItem" ADD CONSTRAINT "BranchMenuItem_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchMenuItem" ADD CONSTRAINT "BranchMenuItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "BranchCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchCategory" ADD CONSTRAINT "BranchCategory_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItemExtra" ADD CONSTRAINT "MenuItemExtra_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItemNote" ADD CONSTRAINT "MenuItemNote_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
