/*
  Warnings:

  - You are about to drop the column `groupId` on the `Extra` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Extra` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Extra` table. All the data in the column will be lost.
  - You are about to drop the `Allergen` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DeliveryZone` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExtraGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MenuCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MenuItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NutritionFacts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OpeningHours` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ItemAllergens` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ItemExtras` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[extra_id]` on the table `Extra` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `admin_name_en` to the `Extra` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer_name_de` to the `Extra` table without a default value. This is not possible if the table is not empty.
  - Added the required column `extra_id` to the `Extra` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sort_order` to the `Extra` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visible` to the `Extra` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Extra" DROP CONSTRAINT "Extra_groupId_fkey";

-- DropForeignKey
ALTER TABLE "MenuItem" DROP CONSTRAINT "MenuItem_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "NutritionFacts" DROP CONSTRAINT "NutritionFacts_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_customerId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_itemId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";

-- DropForeignKey
ALTER TABLE "_ItemAllergens" DROP CONSTRAINT "_ItemAllergens_A_fkey";

-- DropForeignKey
ALTER TABLE "_ItemAllergens" DROP CONSTRAINT "_ItemAllergens_B_fkey";

-- DropForeignKey
ALTER TABLE "_ItemExtras" DROP CONSTRAINT "_ItemExtras_A_fkey";

-- DropForeignKey
ALTER TABLE "_ItemExtras" DROP CONSTRAINT "_ItemExtras_B_fkey";

-- AlterTable
ALTER TABLE "AdminUser" ADD COLUMN     "name" TEXT,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'admin',
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Extra" DROP COLUMN "groupId",
DROP COLUMN "name",
DROP COLUMN "price",
ADD COLUMN     "admin_name_en" TEXT NOT NULL,
ADD COLUMN     "customer_name_de" TEXT NOT NULL,
ADD COLUMN     "extra_id" INTEGER NOT NULL,
ADD COLUMN     "sort_order" INTEGER NOT NULL,
ADD COLUMN     "visible" BOOLEAN NOT NULL;

-- DropTable
DROP TABLE "Allergen";

-- DropTable
DROP TABLE "Customer";

-- DropTable
DROP TABLE "DeliveryZone";

-- DropTable
DROP TABLE "ExtraGroup";

-- DropTable
DROP TABLE "MenuCategory";

-- DropTable
DROP TABLE "MenuItem";

-- DropTable
DROP TABLE "NutritionFacts";

-- DropTable
DROP TABLE "OpeningHours";

-- DropTable
DROP TABLE "Order";

-- DropTable
DROP TABLE "OrderItem";

-- DropTable
DROP TABLE "_ItemAllergens";

-- DropTable
DROP TABLE "_ItemExtras";

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "category_id" INTEGER NOT NULL,
    "admin_name_en" TEXT NOT NULL,
    "customer_name_de" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL,
    "sort_order" INTEGER NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "item_id" INTEGER NOT NULL,
    "admin_name_en" TEXT NOT NULL,
    "customer_name_de" TEXT NOT NULL,
    "description_de" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL,
    "available" BOOLEAN NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "manual_number" INTEGER NOT NULL,
    "category_id" INTEGER,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Variant" (
    "id" SERIAL NOT NULL,
    "variant_id" INTEGER NOT NULL,
    "admin_name_en" TEXT NOT NULL,
    "customer_name_de" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL,
    "available" BOOLEAN NOT NULL,
    "sort_order" INTEGER NOT NULL,

    CONSTRAINT "Variant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topping" (
    "id" SERIAL NOT NULL,
    "topping_id" INTEGER NOT NULL,
    "admin_name_en" TEXT NOT NULL,
    "customer_name_de" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL,
    "sort_order" INTEGER NOT NULL,

    CONSTRAINT "Topping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Relation" (
    "id" SERIAL NOT NULL,
    "item_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "Relation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RelationVariant" (
    "id" SERIAL NOT NULL,
    "relation_id" INTEGER NOT NULL,
    "variant_id" INTEGER NOT NULL,

    CONSTRAINT "RelationVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RelationTopping" (
    "id" SERIAL NOT NULL,
    "relation_id" INTEGER NOT NULL,
    "topping_id" INTEGER NOT NULL,

    CONSTRAINT "RelationTopping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RelationExtra" (
    "id" SERIAL NOT NULL,
    "relation_id" INTEGER NOT NULL,
    "extra_id" INTEGER NOT NULL,

    CONSTRAINT "RelationExtra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deal" (
    "id" SERIAL NOT NULL,
    "deal_id" INTEGER NOT NULL,
    "admin_name_en" TEXT NOT NULL,
    "customer_name_de" TEXT NOT NULL,
    "description_de" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL,
    "available" BOOLEAN NOT NULL,
    "sort_order" INTEGER NOT NULL,

    CONSTRAINT "Deal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DealItem" (
    "id" SERIAL NOT NULL,
    "deal_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,

    CONSTRAINT "DealItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_category_id_key" ON "Category"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "Item_item_id_key" ON "Item"("item_id");

-- CreateIndex
CREATE UNIQUE INDEX "Variant_variant_id_key" ON "Variant"("variant_id");

-- CreateIndex
CREATE UNIQUE INDEX "Topping_topping_id_key" ON "Topping"("topping_id");

-- CreateIndex
CREATE UNIQUE INDEX "Deal_deal_id_key" ON "Deal"("deal_id");

-- CreateIndex
CREATE UNIQUE INDEX "Extra_extra_id_key" ON "Extra"("extra_id");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("category_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relation" ADD CONSTRAINT "Relation_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item"("item_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relation" ADD CONSTRAINT "Relation_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelationVariant" ADD CONSTRAINT "RelationVariant_relation_id_fkey" FOREIGN KEY ("relation_id") REFERENCES "Relation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelationVariant" ADD CONSTRAINT "RelationVariant_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "Variant"("variant_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelationTopping" ADD CONSTRAINT "RelationTopping_relation_id_fkey" FOREIGN KEY ("relation_id") REFERENCES "Relation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelationTopping" ADD CONSTRAINT "RelationTopping_topping_id_fkey" FOREIGN KEY ("topping_id") REFERENCES "Topping"("topping_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelationExtra" ADD CONSTRAINT "RelationExtra_relation_id_fkey" FOREIGN KEY ("relation_id") REFERENCES "Relation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelationExtra" ADD CONSTRAINT "RelationExtra_extra_id_fkey" FOREIGN KEY ("extra_id") REFERENCES "Extra"("extra_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DealItem" ADD CONSTRAINT "DealItem_deal_id_fkey" FOREIGN KEY ("deal_id") REFERENCES "Deal"("deal_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DealItem" ADD CONSTRAINT "DealItem_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item"("item_id") ON DELETE RESTRICT ON UPDATE CASCADE;
