-- CreateTable
CREATE TABLE "BranchItemAvailability" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "menuItemId" INTEGER NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "BranchItemAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BranchItemAvailability_branchId_menuItemId_key" ON "BranchItemAvailability"("branchId", "menuItemId");

-- AddForeignKey
ALTER TABLE "BranchItemAvailability" ADD CONSTRAINT "BranchItemAvailability_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchItemAvailability" ADD CONSTRAINT "BranchItemAvailability_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
