-- CreateTable
CREATE TABLE "PrinterFleet" (
    "id" SERIAL NOT NULL,
    "branchId" TEXT NOT NULL,
    "printerId" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "policy" TEXT,
    "firmware" TEXT,
    "configHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrinterFleet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PrinterFleet_branchId_printerId_key" ON "PrinterFleet"("branchId", "printerId");
