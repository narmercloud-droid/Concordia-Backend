-- Improve order list and monitor query performance
CREATE INDEX "Order_branchId_createdAt_idx" ON "Order"("branchId", "createdAt" DESC);
CREATE INDEX "Order_branchId_status_idx" ON "Order"("branchId", "status");
CREATE INDEX "Order_customerId_idx" ON "Order"("customerId");
CREATE INDEX "Order_paymentStatus_idx" ON "Order"("paymentStatus");
