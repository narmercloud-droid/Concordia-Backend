-- CreateTable
CREATE TABLE "Cart" (
    "id" SERIAL NOT NULL,
    "cart_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "id" SERIAL NOT NULL,
    "cart_id" TEXT NOT NULL,
    "item_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItemVariant" (
    "id" SERIAL NOT NULL,
    "cart_item_id" INTEGER NOT NULL,
    "variant_id" INTEGER NOT NULL,

    CONSTRAINT "CartItemVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItemTopping" (
    "id" SERIAL NOT NULL,
    "cart_item_id" INTEGER NOT NULL,
    "topping_id" INTEGER NOT NULL,

    CONSTRAINT "CartItemTopping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItemExtra" (
    "id" SERIAL NOT NULL,
    "cart_item_id" INTEGER NOT NULL,
    "extra_id" INTEGER NOT NULL,

    CONSTRAINT "CartItemExtra_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cart_cart_id_key" ON "Cart"("cart_id");

-- CreateIndex
CREATE UNIQUE INDEX "CartItemVariant_cart_item_id_key" ON "CartItemVariant"("cart_item_id");

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "Cart"("cart_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item"("item_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItemVariant" ADD CONSTRAINT "CartItemVariant_cart_item_id_fkey" FOREIGN KEY ("cart_item_id") REFERENCES "CartItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItemVariant" ADD CONSTRAINT "CartItemVariant_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "Variant"("variant_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItemTopping" ADD CONSTRAINT "CartItemTopping_cart_item_id_fkey" FOREIGN KEY ("cart_item_id") REFERENCES "CartItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItemTopping" ADD CONSTRAINT "CartItemTopping_topping_id_fkey" FOREIGN KEY ("topping_id") REFERENCES "Topping"("topping_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItemExtra" ADD CONSTRAINT "CartItemExtra_cart_item_id_fkey" FOREIGN KEY ("cart_item_id") REFERENCES "CartItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItemExtra" ADD CONSTRAINT "CartItemExtra_extra_id_fkey" FOREIGN KEY ("extra_id") REFERENCES "Extra"("extra_id") ON DELETE RESTRICT ON UPDATE CASCADE;
