/*
  Warnings:

  - You are about to drop the column `opponentArchetype` on the `Match` table. All the data in the column will be lost.
  - Added the required column `opponentArchetypeId` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Match" ADD COLUMN "opponentArchetypeId" TEXT;

-- CreateTable
CREATE TABLE "OpponentArchetype" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "archetypeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OpponentArchetype_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OpponentArchetype_archetypeId_slug_key" ON "OpponentArchetype"("archetypeId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "OpponentArchetype_archetypeId_name_key" ON "OpponentArchetype"("archetypeId", "name");

-- For every row in the Match table, we need to create a corresponding
-- row in the OpponentArchetype table and set the opponentArchetypeId
-- to the id of the newly created OpponentArchetype row.
INSERT INTO
  "OpponentArchetype"
    ("id", "name", "slug", "archetypeId")
  SELECT DISTINCT
    gen_random_uuid()::text AS id,
    m."opponentArchetype" AS name,
    regexp_replace(lower(m."opponentArchetype"), '\s+', '-', 'g') AS slug,
    e."archetypeId"
  FROM
    "Match" m
  JOIN "Event" e ON m."eventId" = e."id"
ON CONFLICT DO NOTHING;

UPDATE
  "Match" m
SET
  "opponentArchetypeId" = oa."id"
FROM
  "OpponentArchetype" oa,
  "Event" e
WHERE
  m."eventId" = e."id"
  AND m."opponentArchetype" = oa."name"
  AND e."archetypeId" = oa."archetypeId";

-- Set NOT NULL after data is populated
ALTER TABLE "Match" ALTER COLUMN "opponentArchetypeId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "OpponentArchetype" ADD CONSTRAINT "OpponentArchetype_archetypeId_fkey" FOREIGN KEY ("archetypeId") REFERENCES "Archetype"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_opponentArchetypeId_fkey" FOREIGN KEY ("opponentArchetypeId") REFERENCES "OpponentArchetype"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Make the `opponentArchetype` column nullable to avoid issues with newly created
-- rows that don't have an opponent archetype yet. This column will be dropped
-- in a future migration.
ALTER TABLE "Match" ALTER COLUMN "opponentArchetype" DROP NOT NULL;
