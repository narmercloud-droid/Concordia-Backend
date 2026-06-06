/*
  Warnings:

  - You are about to drop the column `itemId` on the `CartItem` table. All the data in the column will be lost.
  - Added the required column `basePrice` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `menuItemId` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `CartItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_cartId_fkey";

-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_itemId_fkey";

-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "itemId",
ADD COLUMN     "addOnIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "basePrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "menuItemId" INTEGER NOT NULL,
ADD COLUMN     "orderId" TEXT,
ADD COLUMN     "totalPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "variantId" TEXT,
ALTER COLUMN "cartId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
