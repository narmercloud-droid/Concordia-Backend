/*
  Warnings:

  - A unique constraint covering the columns `[branchTerminalId]` on the table `TerminalStatus` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "BranchSettings" ALTER COLUMN "branchId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "TerminalStatus" ADD COLUMN     "branchTerminalId" INTEGER;

-- CreateTable
CREATE TABLE "BranchTerminal" (
    "id" SERIAL NOT NULL,
    "branchId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BranchTerminal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BranchTerminal_token_key" ON "BranchTerminal"("token");

-- CreateIndex
CREATE UNIQUE INDEX "TerminalStatus_branchTerminalId_key" ON "TerminalStatus"("branchTerminalId");

-- AddForeignKey
ALTER TABLE "TerminalStatus" ADD CONSTRAINT "TerminalStatus_branchTerminalId_fkey" FOREIGN KEY ("branchTerminalId") REFERENCES "BranchTerminal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchTerminal" ADD CONSTRAINT "BranchTerminal_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
