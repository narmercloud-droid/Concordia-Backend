-- Web push subscriptions for browser offer/order notifications
ALTER TABLE "NotificationPreference" ADD COLUMN IF NOT EXISTS "allowOffers" BOOLEAN NOT NULL DEFAULT true;

CREATE TABLE IF NOT EXISTS "WebPushSubscription" (
  "id" TEXT NOT NULL,
  "endpoint" TEXT NOT NULL,
  "p256dh" TEXT NOT NULL,
  "auth" TEXT NOT NULL,
  "customerId" TEXT,
  "allowOffers" BOOLEAN NOT NULL DEFAULT true,
  "allowOrders" BOOLEAN NOT NULL DEFAULT true,
  "branchId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "WebPushSubscription_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "WebPushSubscription_endpoint_key" ON "WebPushSubscription"("endpoint");
CREATE INDEX IF NOT EXISTS "WebPushSubscription_customerId_idx" ON "WebPushSubscription"("customerId");
CREATE INDEX IF NOT EXISTS "WebPushSubscription_allowOffers_idx" ON "WebPushSubscription"("allowOffers");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'WebPushSubscription_customerId_fkey'
  ) THEN
    ALTER TABLE "WebPushSubscription"
      ADD CONSTRAINT "WebPushSubscription_customerId_fkey"
      FOREIGN KEY ("customerId") REFERENCES "Customer"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
