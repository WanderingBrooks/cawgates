-- AlterTable
ALTER TABLE "Match" ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0;

-- Backfill order for existing matches using createdAt order within each event
UPDATE
  "Match" m
SET
  "order" = sub.row_num - 1
FROM (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY
        "eventId"
      ORDER BY
        "createdAt" ASC
    ) AS row_num
  FROM "Match"
) sub
WHERE
  m.id = sub.id;
