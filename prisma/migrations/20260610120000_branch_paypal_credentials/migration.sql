-- Per-branch PayPal REST app credentials (each branch can use its own PayPal business account).
ALTER TABLE "BranchPaymentSettings" ADD COLUMN IF NOT EXISTS "paypalClientId" TEXT;
ALTER TABLE "BranchPaymentSettings" ADD COLUMN IF NOT EXISTS "paypalClientSecret" TEXT;
ALTER TABLE "BranchPaymentSettings" ADD COLUMN IF NOT EXISTS "paypalWebhookId" TEXT;
