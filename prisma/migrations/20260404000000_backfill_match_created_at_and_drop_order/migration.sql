-- Backfill createdAt: offset each match by its order value in seconds to preserve ordering
UPDATE "Match"
SET "createdAt" = "createdAt" + ("order" * INTERVAL '1 second');

-- Drop the now-obsolete order column
ALTER TABLE "Match" DROP COLUMN "order";
