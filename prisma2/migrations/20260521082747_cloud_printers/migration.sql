-- CreateTable
CREATE TABLE "CloudPrinter" (
    "id" SERIAL NOT NULL,
    "branchId" TEXT NOT NULL,
    "printerId" TEXT NOT NULL,
    "kitchen" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "trustScore" INTEGER NOT NULL DEFAULT 100,
    "online" BOOLEAN NOT NULL DEFAULT false,
    "lastSync" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CloudPrinter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CloudPrinter_branchId_printerId_key" ON "CloudPrinter"("branchId", "printerId");
