-- CreateIndex
CREATE INDEX "BranchCategory_branchId_idx" ON "BranchCategory"("branchId");

-- CreateIndex
CREATE INDEX "BranchMenuItem_branchId_isAvailable_idx" ON "BranchMenuItem"("branchId", "isAvailable");
