-- Formats: decks and opponent archetypes move from being scoped per deck to per format.
-- Every existing user gets a single "Pauper" format containing all their decks, and
-- opponent archetypes with the same name (trimmed, case-insensitive) are merged.

-- CreateTable
CREATE TABLE "Format" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Format_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Format_userId_name_key" ON "Format"("userId", "name");

ALTER TABLE "Format" ADD CONSTRAINT "Format_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill one default format per user
INSERT INTO "Format" ("id", "name", "userId")
SELECT gen_random_uuid()::text, 'Pauper', "id" FROM "User";

-- Put every deck in its owner's default format
ALTER TABLE "Deck" ADD COLUMN "formatId" TEXT;

UPDATE "Deck" d
SET "formatId" = f."id"
FROM "Format" f
WHERE f."userId" = d."userId";

ALTER TABLE "Deck" ALTER COLUMN "formatId" SET NOT NULL;

ALTER TABLE "Deck" ADD CONSTRAINT "Deck_formatId_fkey" FOREIGN KEY ("formatId") REFERENCES "Format"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- Scope opponent archetypes to their deck's format
ALTER TABLE "OpponentArchetype" ADD COLUMN "formatId" TEXT;

UPDATE "OpponentArchetype" oa
SET "formatId" = d."formatId"
FROM "Deck" d
WHERE d."id" = oa."deckId";

-- Merge duplicate archetypes within a format. The oldest one survives.
CREATE TEMP TABLE "archetype_merge" AS
SELECT
    "id",
    first_value("id") OVER (
        PARTITION BY "formatId", lower(trim("name"))
        ORDER BY "createdAt", "id"
    ) AS "survivorId"
FROM "OpponentArchetype";

UPDATE "Match" m
SET "opponentArchetypeId" = am."survivorId"
FROM "archetype_merge" am
WHERE m."opponentArchetypeId" = am."id"
  AND am."id" <> am."survivorId";

DELETE FROM "OpponentArchetype" oa
USING "archetype_merge" am
WHERE oa."id" = am."id"
  AND am."id" <> am."survivorId";

DROP TABLE "archetype_merge";

UPDATE "OpponentArchetype" SET "name" = trim("name") WHERE "name" <> trim("name");

-- Remove the old deck scoping. "deckId" itself is kept (nullable, no FK) so the
-- previous deployment can keep reading it until the new one is live; it's dropped
-- in a later migration (see COLUMNS_TO_DROP.md). The FK must go now: it cascades,
-- and deleting a deck must no longer delete archetypes shared across the format.
ALTER TABLE "OpponentArchetype" DROP CONSTRAINT "OpponentArchetype_deckId_fkey";

DROP INDEX "OpponentArchetype_deckId_name_key";

ALTER TABLE "OpponentArchetype" ALTER COLUMN "deckId" DROP NOT NULL;

ALTER TABLE "OpponentArchetype" ALTER COLUMN "formatId" SET NOT NULL;

CREATE UNIQUE INDEX "OpponentArchetype_formatId_name_key" ON "OpponentArchetype"("formatId", "name");

ALTER TABLE "OpponentArchetype" ADD CONSTRAINT "OpponentArchetype_formatId_fkey" FOREIGN KEY ("formatId") REFERENCES "Format"("id") ON DELETE CASCADE ON UPDATE CASCADE;
