-- CreateTable
CREATE TABLE "CustomerBranchStripe" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "stripeCustomerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerBranchStripe_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomerBranchStripe_customerId_branchId_key" ON "CustomerBranchStripe"("customerId", "branchId");

-- CreateIndex
CREATE INDEX "CustomerBranchStripe_branchId_idx" ON "CustomerBranchStripe"("branchId");

-- AddForeignKey
ALTER TABLE "CustomerBranchStripe" ADD CONSTRAINT "CustomerBranchStripe_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
