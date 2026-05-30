-- CreateTable
CREATE TABLE "ExtraGroup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ExtraGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Extra" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "groupId" INTEGER NOT NULL,

    CONSTRAINT "Extra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Allergen" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Allergen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NutritionFacts" (
    "id" SERIAL NOT NULL,
    "calories" INTEGER NOT NULL,
    "protein" DOUBLE PRECISION NOT NULL,
    "carbs" DOUBLE PRECISION NOT NULL,
    "fat" DOUBLE PRECISION NOT NULL,
    "itemId" INTEGER NOT NULL,

    CONSTRAINT "NutritionFacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ItemExtras" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ItemAllergens" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "NutritionFacts_itemId_key" ON "NutritionFacts"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "_ItemExtras_AB_unique" ON "_ItemExtras"("A", "B");

-- CreateIndex
CREATE INDEX "_ItemExtras_B_index" ON "_ItemExtras"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ItemAllergens_AB_unique" ON "_ItemAllergens"("A", "B");

-- CreateIndex
CREATE INDEX "_ItemAllergens_B_index" ON "_ItemAllergens"("B");

-- AddForeignKey
ALTER TABLE "Extra" ADD CONSTRAINT "Extra_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "ExtraGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionFacts" ADD CONSTRAINT "NutritionFacts_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemExtras" ADD CONSTRAINT "_ItemExtras_A_fkey" FOREIGN KEY ("A") REFERENCES "Extra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemExtras" ADD CONSTRAINT "_ItemExtras_B_fkey" FOREIGN KEY ("B") REFERENCES "MenuItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemAllergens" ADD CONSTRAINT "_ItemAllergens_A_fkey" FOREIGN KEY ("A") REFERENCES "Allergen"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemAllergens" ADD CONSTRAINT "_ItemAllergens_B_fkey" FOREIGN KEY ("B") REFERENCES "MenuItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
