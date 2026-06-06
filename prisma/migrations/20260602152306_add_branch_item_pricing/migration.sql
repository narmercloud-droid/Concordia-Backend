-- CreateTable
CREATE TABLE "BranchItemPricing" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "menuItemId" INTEGER NOT NULL,
    "price" DOUBLE PRECISION,

    CONSTRAINT "BranchItemPricing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BranchItemPricing_branchId_menuItemId_key" ON "BranchItemPricing"("branchId", "menuItemId");

-- AddForeignKey
ALTER TABLE "BranchItemPricing" ADD CONSTRAINT "BranchItemPricing_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchItemPricing" ADD CONSTRAINT "BranchItemPricing_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
