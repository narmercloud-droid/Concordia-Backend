-- Per-branch PayPal REST app credentials (each branch can use its own PayPal business account).
-- BranchPaymentSettings is created in a later migration; skip here on fresh databases.
DO $$
BEGIN
  IF to_regclass('"BranchPaymentSettings"') IS NOT NULL THEN
    ALTER TABLE "BranchPaymentSettings" ADD COLUMN IF NOT EXISTS "paypalClientId" TEXT;
    ALTER TABLE "BranchPaymentSettings" ADD COLUMN IF NOT EXISTS "paypalClientSecret" TEXT;
    ALTER TABLE "BranchPaymentSettings" ADD COLUMN IF NOT EXISTS "paypalWebhookId" TEXT;
  END IF;
END $$;
