-- CreateTable
CREATE TABLE "BranchHours" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "openTime" TEXT NOT NULL,
    "closeTime" TEXT NOT NULL,

    CONSTRAINT "BranchHours_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BranchHours_branchId_dayOfWeek_key" ON "BranchHours"("branchId", "dayOfWeek");

-- AddForeignKey
ALTER TABLE "BranchHours" ADD CONSTRAINT "BranchHours_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
