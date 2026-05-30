-- CreateTable
CREATE TABLE "PrinterTrace" (
    "id" SERIAL NOT NULL,
    "printerId" TEXT NOT NULL,
    "kitchen" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "durationMs" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PrinterTrace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrinterHealth" (
    "id" SERIAL NOT NULL,
    "printerId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 100,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PrinterHealth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrinterAnomaly" (
    "id" SERIAL NOT NULL,
    "printerId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "severity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PrinterAnomaly_pkey" PRIMARY KEY ("id")
);
