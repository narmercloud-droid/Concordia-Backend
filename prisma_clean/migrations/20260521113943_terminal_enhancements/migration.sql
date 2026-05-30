-- CreateTable
CREATE TABLE "TerminalStatus" (
    "id" SERIAL NOT NULL,
    "terminalId" INTEGER NOT NULL,
    "branchId" INTEGER NOT NULL,
    "online" BOOLEAN NOT NULL DEFAULT false,
    "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedKitchen" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TerminalStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TerminalError" (
    "id" SERIAL NOT NULL,
    "terminalId" INTEGER NOT NULL,
    "branchId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "severity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TerminalError_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TerminalStatus_terminalId_branchId_key" ON "TerminalStatus"("terminalId", "branchId");
