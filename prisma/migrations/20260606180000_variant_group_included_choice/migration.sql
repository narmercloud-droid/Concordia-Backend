-- Allow managers to mark variant groups as free included choices (e.g. salad dressing, pasta type)
ALTER TABLE "VariantGroup" ADD COLUMN IF NOT EXISTS "includedChoice" BOOLEAN NOT NULL DEFAULT false;
