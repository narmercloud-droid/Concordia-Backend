/*
  Warnings:

  - The `status` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[tracking_token]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `branch_id` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer_email` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer_name` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer_phone` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tracking_token` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('pending', 'assigned', 'accepted', 'preparing', 'ready', 'completed', 'rejected');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "branch_id" INTEGER NOT NULL,
ADD COLUMN     "customer_email" TEXT NOT NULL,
ADD COLUMN     "customer_name" TEXT NOT NULL,
ADD COLUMN     "customer_phone" TEXT NOT NULL,
ADD COLUMN     "terminal_id" INTEGER,
ADD COLUMN     "tracking_token" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
DROP COLUMN "status",
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'pending';

-- CreateTable
CREATE TABLE "Branch" (
    "id" SERIAL NOT NULL,
    "branch_code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Terminal" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "activation_token" TEXT NOT NULL,
    "branch_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Terminal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BranchSettings" (
    "id" SERIAL NOT NULL,
    "branch_id" INTEGER NOT NULL,
    "config" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BranchSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BranchTerminal" (
    "id" SERIAL NOT NULL,
    "branch_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "last_seen" TIMESTAMP(3),
    "is_online" BOOLEAN NOT NULL DEFAULT false,
    "terminal_token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BranchTerminal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BranchZone" (
    "id" SERIAL NOT NULL,
    "branch_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "radius_km" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "BranchZone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BranchItemOverride" (
    "id" SERIAL NOT NULL,
    "branch_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "price" DOUBLE PRECISION,
    "available" BOOLEAN,

    CONSTRAINT "BranchItemOverride_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BranchVariantOverride" (
    "id" SERIAL NOT NULL,
    "branch_id" INTEGER NOT NULL,
    "variant_id" INTEGER NOT NULL,
    "price" DOUBLE PRECISION,
    "available" BOOLEAN,

    CONSTRAINT "BranchVariantOverride_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BranchToppingOverride" (
    "id" SERIAL NOT NULL,
    "branch_id" INTEGER NOT NULL,
    "topping_id" INTEGER NOT NULL,
    "price" DOUBLE PRECISION,
    "available" BOOLEAN,

    CONSTRAINT "BranchToppingOverride_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BranchExtraOverride" (
    "id" SERIAL NOT NULL,
    "branch_id" INTEGER NOT NULL,
    "extra_id" INTEGER NOT NULL,
    "price" DOUBLE PRECISION,
    "available" BOOLEAN,

    CONSTRAINT "BranchExtraOverride_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KitchenDisplay" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "branchId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KitchenDisplay_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Branch_branch_code_key" ON "Branch"("branch_code");

-- CreateIndex
CREATE UNIQUE INDEX "Terminal_activation_token_key" ON "Terminal"("activation_token");

-- CreateIndex
CREATE UNIQUE INDEX "BranchSettings_branch_id_key" ON "BranchSettings"("branch_id");

-- CreateIndex
CREATE UNIQUE INDEX "BranchTerminal_terminal_token_key" ON "BranchTerminal"("terminal_token");

-- CreateIndex
CREATE UNIQUE INDEX "KitchenDisplay_apiKey_key" ON "KitchenDisplay"("apiKey");

-- CreateIndex
CREATE UNIQUE INDEX "Order_tracking_token_key" ON "Order"("tracking_token");

-- AddForeignKey
ALTER TABLE "Terminal" ADD CONSTRAINT "Terminal_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchSettings" ADD CONSTRAINT "BranchSettings_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchTerminal" ADD CONSTRAINT "BranchTerminal_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchZone" ADD CONSTRAINT "BranchZone_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchItemOverride" ADD CONSTRAINT "BranchItemOverride_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchItemOverride" ADD CONSTRAINT "BranchItemOverride_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item"("item_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchVariantOverride" ADD CONSTRAINT "BranchVariantOverride_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchVariantOverride" ADD CONSTRAINT "BranchVariantOverride_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "Variant"("variant_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchToppingOverride" ADD CONSTRAINT "BranchToppingOverride_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchToppingOverride" ADD CONSTRAINT "BranchToppingOverride_topping_id_fkey" FOREIGN KEY ("topping_id") REFERENCES "Topping"("topping_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchExtraOverride" ADD CONSTRAINT "BranchExtraOverride_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchExtraOverride" ADD CONSTRAINT "BranchExtraOverride_extra_id_fkey" FOREIGN KEY ("extra_id") REFERENCES "Extra"("extra_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_terminal_id_fkey" FOREIGN KEY ("terminal_id") REFERENCES "BranchTerminal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KitchenDisplay" ADD CONSTRAINT "KitchenDisplay_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
