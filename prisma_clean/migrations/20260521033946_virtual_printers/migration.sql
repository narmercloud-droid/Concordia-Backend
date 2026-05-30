-- CreateTable
CREATE TABLE "PrinterSecurity" (
    "id" SERIAL NOT NULL,
    "printerId" TEXT NOT NULL,
    "kitchen" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "token" TEXT NOT NULL,
    "trustScore" INTEGER NOT NULL DEFAULT 100,
    "tampered" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrinterSecurity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VirtualPrinter" (
    "id" SERIAL NOT NULL,
    "kitchen" TEXT NOT NULL,
    "instanceId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "releasedAt" TIMESTAMP(3),

    CONSTRAINT "VirtualPrinter_pkey" PRIMARY KEY ("id")
);
