-- Add separate food and delivery ratings for website order reviews.
ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "foodRating" INTEGER;
ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "deliveryRating" INTEGER;

UPDATE "Review" SET "foodRating" = "rating" WHERE "foodRating" IS NULL;

ALTER TABLE "Review" ALTER COLUMN "foodRating" SET NOT NULL;
ALTER TABLE "Review" ALTER COLUMN "rating" DROP NOT NULL;
ALTER TABLE "Review" ALTER COLUMN "customerId" DROP NOT NULL;

CREATE INDEX IF NOT EXISTS "Review_branchId_createdAt_idx" ON "Review"("branchId", "createdAt");
