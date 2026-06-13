-- Mark Straelen branch as coming soon on the customer website.
UPDATE "BranchConfig"
SET
  "configJson" = (
    COALESCE("configJson"::jsonb, '{}'::jsonb) || '{"status":"coming_soon"}'::jsonb
  ),
  "updatedAt" = NOW()
WHERE "branchId" = 'concordia-straelen';
