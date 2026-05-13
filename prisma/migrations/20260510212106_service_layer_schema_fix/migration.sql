/*
  Warnings:

  - The primary key for the `Branch` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `branch_code` on the `Branch` table. All the data in the column will be lost.
  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `admin_name_en` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `category_id` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `customer_name_de` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `sort_order` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `visible` on the `Category` table. All the data in the column will be lost.
  - The primary key for the `Order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `branch_id` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `cart_id` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `customer_email` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `customer_name` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `customer_phone` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryType` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `estimated_time` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `order_id` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `subtotal` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `terminal_id` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `tracking_token` on the `Order` table. All the data in the column will be lost.
  - The `status` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `OrderItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `base_price` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `item_id` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `order_id` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `total_price` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the `AdminUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BranchExtraOverride` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BranchItemOverride` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BranchSettings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BranchTerminal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BranchToppingOverride` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BranchVariantOverride` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BranchZone` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Cart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CartItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CartItemExtra` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CartItemTopping` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CartItemVariant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Deal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DealItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Extra` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `KitchenDisplay` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderItemExtra` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderItemTopping` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderItemVariant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Relation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RelationExtra` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RelationTopping` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RelationVariant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Terminal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Topping` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Variant` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `branchId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Made the column `updatedAt` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `itemId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variantId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BranchExtraOverride" DROP CONSTRAINT "BranchExtraOverride_branch_id_fkey";

-- DropForeignKey
ALTER TABLE "BranchExtraOverride" DROP CONSTRAINT "BranchExtraOverride_extra_id_fkey";

-- DropForeignKey
ALTER TABLE "BranchItemOverride" DROP CONSTRAINT "BranchItemOverride_branch_id_fkey";

-- DropForeignKey
ALTER TABLE "BranchItemOverride" DROP CONSTRAINT "BranchItemOverride_item_id_fkey";

-- DropForeignKey
ALTER TABLE "BranchSettings" DROP CONSTRAINT "BranchSettings_branch_id_fkey";

-- DropForeignKey
ALTER TABLE "BranchTerminal" DROP CONSTRAINT "BranchTerminal_branch_id_fkey";

-- DropForeignKey
ALTER TABLE "BranchToppingOverride" DROP CONSTRAINT "BranchToppingOverride_branch_id_fkey";

-- DropForeignKey
ALTER TABLE "BranchToppingOverride" DROP CONSTRAINT "BranchToppingOverride_topping_id_fkey";

-- DropForeignKey
ALTER TABLE "BranchVariantOverride" DROP CONSTRAINT "BranchVariantOverride_branch_id_fkey";

-- DropForeignKey
ALTER TABLE "BranchVariantOverride" DROP CONSTRAINT "BranchVariantOverride_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "BranchZone" DROP CONSTRAINT "BranchZone_branch_id_fkey";

-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_cart_id_fkey";

-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_item_id_fkey";

-- DropForeignKey
ALTER TABLE "CartItemExtra" DROP CONSTRAINT "CartItemExtra_cart_item_id_fkey";

-- DropForeignKey
ALTER TABLE "CartItemExtra" DROP CONSTRAINT "CartItemExtra_extra_id_fkey";

-- DropForeignKey
ALTER TABLE "CartItemTopping" DROP CONSTRAINT "CartItemTopping_cart_item_id_fkey";

-- DropForeignKey
ALTER TABLE "CartItemTopping" DROP CONSTRAINT "CartItemTopping_topping_id_fkey";

-- DropForeignKey
ALTER TABLE "CartItemVariant" DROP CONSTRAINT "CartItemVariant_cart_item_id_fkey";

-- DropForeignKey
ALTER TABLE "CartItemVariant" DROP CONSTRAINT "CartItemVariant_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "DealItem" DROP CONSTRAINT "DealItem_deal_id_fkey";

-- DropForeignKey
ALTER TABLE "DealItem" DROP CONSTRAINT "DealItem_item_id_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_category_id_fkey";

-- DropForeignKey
ALTER TABLE "KitchenDisplay" DROP CONSTRAINT "KitchenDisplay_branchId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_branch_id_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_terminal_id_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_item_id_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_order_id_fkey";

-- DropForeignKey
ALTER TABLE "OrderItemExtra" DROP CONSTRAINT "OrderItemExtra_extra_id_fkey";

-- DropForeignKey
ALTER TABLE "OrderItemExtra" DROP CONSTRAINT "OrderItemExtra_order_item_id_fkey";

-- DropForeignKey
ALTER TABLE "OrderItemTopping" DROP CONSTRAINT "OrderItemTopping_order_item_id_fkey";

-- DropForeignKey
ALTER TABLE "OrderItemTopping" DROP CONSTRAINT "OrderItemTopping_topping_id_fkey";

-- DropForeignKey
ALTER TABLE "OrderItemVariant" DROP CONSTRAINT "OrderItemVariant_order_item_id_fkey";

-- DropForeignKey
ALTER TABLE "OrderItemVariant" DROP CONSTRAINT "OrderItemVariant_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "Relation" DROP CONSTRAINT "Relation_category_id_fkey";

-- DropForeignKey
ALTER TABLE "Relation" DROP CONSTRAINT "Relation_item_id_fkey";

-- DropForeignKey
ALTER TABLE "RelationExtra" DROP CONSTRAINT "RelationExtra_extra_id_fkey";

-- DropForeignKey
ALTER TABLE "RelationExtra" DROP CONSTRAINT "RelationExtra_relation_id_fkey";

-- DropForeignKey
ALTER TABLE "RelationTopping" DROP CONSTRAINT "RelationTopping_relation_id_fkey";

-- DropForeignKey
ALTER TABLE "RelationTopping" DROP CONSTRAINT "RelationTopping_topping_id_fkey";

-- DropForeignKey
ALTER TABLE "RelationVariant" DROP CONSTRAINT "RelationVariant_relation_id_fkey";

-- DropForeignKey
ALTER TABLE "RelationVariant" DROP CONSTRAINT "RelationVariant_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "Terminal" DROP CONSTRAINT "Terminal_branch_id_fkey";

-- DropIndex
DROP INDEX "Branch_branch_code_key";

-- DropIndex
DROP INDEX "Category_category_id_key";

-- DropIndex
DROP INDEX "Order_order_id_key";

-- DropIndex
DROP INDEX "Order_tracking_token_key";

-- AlterTable
ALTER TABLE "Branch" DROP CONSTRAINT "Branch_pkey",
DROP COLUMN "branch_code",
ADD COLUMN     "cuisine" TEXT,
ADD COLUMN     "lat" DOUBLE PRECISION,
ADD COLUMN     "lng" DOUBLE PRECISION,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Branch_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Branch_id_seq";

-- AlterTable
ALTER TABLE "Category" DROP CONSTRAINT "Category_pkey",
DROP COLUMN "admin_name_en",
DROP COLUMN "category_id",
DROP COLUMN "customer_name_de",
DROP COLUMN "sort_order",
DROP COLUMN "visible",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Category_id_seq";

-- AlterTable
ALTER TABLE "Order" DROP CONSTRAINT "Order_pkey",
DROP COLUMN "branch_id",
DROP COLUMN "cart_id",
DROP COLUMN "customer_email",
DROP COLUMN "customer_name",
DROP COLUMN "customer_phone",
DROP COLUMN "deliveryType",
DROP COLUMN "estimated_time",
DROP COLUMN "order_id",
DROP COLUMN "subtotal",
DROP COLUMN "terminal_id",
DROP COLUMN "total",
DROP COLUMN "tracking_token",
ADD COLUMN     "branchId" TEXT NOT NULL,
ADD COLUMN     "courierStatus" TEXT,
ADD COLUMN     "courierToken" TEXT,
ADD COLUMN     "courierTokenExpiresAt" TIMESTAMP(3),
ADD COLUMN     "customerId" TEXT,
ADD COLUMN     "isGuest" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paymentIntentId" TEXT,
ADD COLUMN     "paymentMethod" TEXT NOT NULL,
ADD COLUMN     "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "paypalCaptureId" TEXT,
ADD COLUMN     "paypalOrderId" TEXT,
ADD COLUMN     "scheduledFor" TIMESTAMP(3),
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "updatedAt" SET NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending',
ADD CONSTRAINT "Order_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Order_id_seq";

-- AlterTable
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_pkey",
DROP COLUMN "base_price",
DROP COLUMN "item_id",
DROP COLUMN "order_id",
DROP COLUMN "total_price",
ADD COLUMN     "addOnIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "itemId" TEXT NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "orderId" TEXT NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "variantId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "quantity" SET DEFAULT 1,
ADD CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "OrderItem_id_seq";

-- DropTable
DROP TABLE "AdminUser";

-- DropTable
DROP TABLE "BranchExtraOverride";

-- DropTable
DROP TABLE "BranchItemOverride";

-- DropTable
DROP TABLE "BranchSettings";

-- DropTable
DROP TABLE "BranchTerminal";

-- DropTable
DROP TABLE "BranchToppingOverride";

-- DropTable
DROP TABLE "BranchVariantOverride";

-- DropTable
DROP TABLE "BranchZone";

-- DropTable
DROP TABLE "Cart";

-- DropTable
DROP TABLE "CartItem";

-- DropTable
DROP TABLE "CartItemExtra";

-- DropTable
DROP TABLE "CartItemTopping";

-- DropTable
DROP TABLE "CartItemVariant";

-- DropTable
DROP TABLE "Deal";

-- DropTable
DROP TABLE "DealItem";

-- DropTable
DROP TABLE "Extra";

-- DropTable
DROP TABLE "Item";

-- DropTable
DROP TABLE "KitchenDisplay";

-- DropTable
DROP TABLE "OrderItemExtra";

-- DropTable
DROP TABLE "OrderItemTopping";

-- DropTable
DROP TABLE "OrderItemVariant";

-- DropTable
DROP TABLE "Relation";

-- DropTable
DROP TABLE "RelationExtra";

-- DropTable
DROP TABLE "RelationTopping";

-- DropTable
DROP TABLE "RelationVariant";

-- DropTable
DROP TABLE "Terminal";

-- DropTable
DROP TABLE "Topping";

-- DropTable
DROP TABLE "Variant";

-- DropEnum
DROP TYPE "OrderStatus";

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Courier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "vehicle" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Courier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationPreference" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "allowPush" BOOLEAN NOT NULL DEFAULT true,
    "allowSMS" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "NotificationPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoyaltyPoints" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "LoyaltyPoints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reward" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "costPoints" INTEGER NOT NULL,
    "discount" DOUBLE PRECISION,
    "amountOff" DOUBLE PRECISION,
    "freeItemId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromoCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "discount" DOUBLE PRECISION,
    "amountOff" DOUBLE PRECISION,
    "expiresAt" TIMESTAMP(3),
    "maxUses" INTEGER,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PromoCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Referral" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "referredCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Referral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "stock" INTEGER DEFAULT 999999,
    "lowStockThreshold" INTEGER DEFAULT 5,
    "autoDisable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "MenuItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "instructions" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeliveryZone" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "maxDistanceKm" DOUBLE PRECISION NOT NULL,
    "baseFee" DOUBLE PRECISION NOT NULL,
    "perKmFee" DOUBLE PRECISION NOT NULL,
    "freeDeliveryThreshold" DOUBLE PRECISION,
    "minimumOrderAmount" DOUBLE PRECISION,

    CONSTRAINT "DeliveryZone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchLog" (
    "id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SearchLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BranchSchedule" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "openTime" TEXT NOT NULL,
    "closeTime" TEXT NOT NULL,

    CONSTRAINT "BranchSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourierLocation" (
    "id" TEXT NOT NULL,
    "courierId" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "speed" DOUBLE PRECISION,
    "heading" DOUBLE PRECISION,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourierLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderTrackingEvent" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderTrackingEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemRating" (
    "id" TEXT NOT NULL,
    "orderItemId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,

    CONSTRAINT "ItemRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskScore" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "level" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RiskScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FraudFlag" (
    "id" TEXT NOT NULL,
    "customerId" TEXT,
    "orderId" TEXT,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FraudFlag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderRiskEvent" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderRiskEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceHistory" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "oldPrice" DOUBLE PRECISION NOT NULL,
    "newPrice" DOUBLE PRECISION NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PriceHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DynamicPriceRule" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "itemId" TEXT,
    "ruleType" TEXT NOT NULL,
    "multiplier" DOUBLE PRECISION,
    "amount" DOUBLE PRECISION,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DynamicPriceRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsightLog" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "impact" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InsightLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DecisionLog" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "impact" TEXT NOT NULL,
    "autoApplied" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DecisionLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutomationSettings" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "pricing" BOOLEAN NOT NULL DEFAULT false,
    "marketing" BOOLEAN NOT NULL DEFAULT false,
    "inventory" BOOLEAN NOT NULL DEFAULT false,
    "staffing" BOOLEAN NOT NULL DEFAULT false,
    "retention" BOOLEAN NOT NULL DEFAULT false,
    "fraud" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AutomationSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsQueryLog" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticsQueryLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OptimizationLog" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "parameter" TEXT NOT NULL,
    "oldValue" DOUBLE PRECISION,
    "newValue" DOUBLE PRECISION,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OptimizationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OptimizationParameters" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "pricingMultiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "forecastWeight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "churnThreshold" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "behaviorConfidence" DOUBLE PRECISION NOT NULL DEFAULT 0.7,
    "staffingRatio" DOUBLE PRECISION NOT NULL DEFAULT 3.0,
    "inventoryThreshold" DOUBLE PRECISION NOT NULL DEFAULT 2.0,

    CONSTRAINT "OptimizationParameters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrchestrationLog" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "cycleType" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrchestrationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemoryRecord" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MemoryRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrendRecord" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrendRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntelligenceReport" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "details" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntelligenceReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DashboardViewLog" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DashboardViewLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationLog" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConversationLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Courier_email_key" ON "Courier"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationPreference_customerId_key" ON "NotificationPreference"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "LoyaltyPoints_customerId_key" ON "LoyaltyPoints"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "PromoCode_code_key" ON "PromoCode"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Referral_customerId_key" ON "Referral"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "Referral_code_key" ON "Referral"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_customerId_itemId_key" ON "Favorite"("customerId", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "DeliveryZone_branchId_key" ON "DeliveryZone"("branchId");

-- CreateIndex
CREATE UNIQUE INDEX "CourierLocation_courierId_key" ON "CourierLocation"("courierId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_orderId_key" ON "Review"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "ItemRating_orderItemId_key" ON "ItemRating"("orderItemId");

-- CreateIndex
CREATE UNIQUE INDEX "RiskScore_orderId_key" ON "RiskScore"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "AutomationSettings_branchId_key" ON "AutomationSettings"("branchId");

-- CreateIndex
CREATE UNIQUE INDEX "OptimizationParameters_branchId_key" ON "OptimizationParameters"("branchId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationPreference" ADD CONSTRAINT "NotificationPreference_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoyaltyPoints" ADD CONSTRAINT "LoyaltyPoints_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryZone" ADD CONSTRAINT "DeliveryZone_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchSchedule" ADD CONSTRAINT "BranchSchedule_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourierLocation" ADD CONSTRAINT "CourierLocation_courierId_fkey" FOREIGN KEY ("courierId") REFERENCES "Courier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderTrackingEvent" ADD CONSTRAINT "OrderTrackingEvent_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemRating" ADD CONSTRAINT "ItemRating_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskScore" ADD CONSTRAINT "RiskScore_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderRiskEvent" ADD CONSTRAINT "OrderRiskEvent_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceHistory" ADD CONSTRAINT "PriceHistory_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
