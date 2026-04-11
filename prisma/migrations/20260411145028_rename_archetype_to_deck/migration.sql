-- Rename Archetype to Deck and update all references accordingly


-- Drop old foreign key constraints to prepare for renaming
ALTER TABLE "Event" DROP CONSTRAINT "Event_archetypeId_fkey";
ALTER TABLE "OpponentArchetype" DROP CONSTRAINT "OpponentArchetype_archetypeId_fkey";

-- Drop old indexes that reference the old table/column names
DROP INDEX "Archetype_userId_name_key";
DROP INDEX "Archetype_userId_slug_key";
DROP INDEX "OpponentArchetype_archetypeId_name_key";

-- Rename the Archetype table to Deck
ALTER TABLE "Archetype" RENAME TO "Deck";

-- Rename archetypeId columns to deckId in referencing tables
ALTER TABLE "Event" RENAME COLUMN "archetypeId" TO "deckId";
ALTER TABLE "OpponentArchetype" RENAME COLUMN "archetypeId" TO "deckId";

-- Create new indexes for the renamed Deck table
CREATE UNIQUE INDEX "Deck_userId_name_key" ON "Deck"("userId", "name");
CREATE UNIQUE INDEX "Deck_userId_slug_key" ON "Deck"("userId", "slug");

-- Create new index for OpponentArchetype with the renamed column
CREATE UNIQUE INDEX "OpponentArchetype_deckId_name_key" ON "OpponentArchetype"("deckId", "name");

-- Add foreign key constraints for the new structure
ALTER TABLE "Deck" ADD CONSTRAINT "Deck_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Event" ADD CONSTRAINT "Event_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OpponentArchetype" ADD CONSTRAINT "OpponentArchetype_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex
CREATE UNIQUE INDEX "OpponentArchetype_deckId_name_key" ON "OpponentArchetype"("deckId", "name");

-- AddForeignKey
ALTER TABLE "Deck" ADD CONSTRAINT "Deck_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpponentArchetype" ADD CONSTRAINT "OpponentArchetype_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE CASCADE ON UPDATE CASCADE;
