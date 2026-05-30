-- CreateTable
CREATE TABLE "BranchSettings" (
    "id" SERIAL NOT NULL,
    "branchId" INTEGER NOT NULL,
    "printingMode" TEXT NOT NULL DEFAULT 'direct',
    "autoPrint" BOOLEAN NOT NULL DEFAULT true,
    "printCopies" INTEGER NOT NULL DEFAULT 1,
    "routingMode" TEXT NOT NULL DEFAULT 'kitchen',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BranchSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BranchSettings_branchId_key" ON "BranchSettings"("branchId");
