-- Rename table from Archetype to Deck
ALTER TABLE "Archetype" RENAME TO "Deck";

-- Rename archetypeId column to deckId in Event table
ALTER TABLE "Event" RENAME COLUMN "archetypeId" TO "deckId";

-- Rename archetypeId column to deckId in OpponentArchetype table
ALTER TABLE "OpponentArchetype" RENAME COLUMN "archetypeId" TO "deckId";

-- Rename foreign key constraints
ALTER TABLE "Event" RENAME CONSTRAINT "Event_archetypeId_fkey" TO "Event_deckId_fkey";
ALTER TABLE "OpponentArchetype" RENAME CONSTRAINT "OpponentArchetype_archetypeId_fkey" TO "OpponentArchetype_deckId_fkey";

-- Rename unique indexes
ALTER INDEX "Archetype_userId_name_key" RENAME TO "Deck_userId_name_key";
ALTER INDEX "Archetype_userId_slug_key" RENAME TO "Deck_userId_slug_key";
ALTER INDEX "OpponentArchetype_archetypeId_name_key" RENAME TO "OpponentArchetype_deckId_name_key";

-- Rename primary key constraint
ALTER TABLE "Deck" RENAME CONSTRAINT "Archetype_pkey" TO "Deck_pkey";
ALTER TABLE "Deck" RENAME CONSTRAINT "Archetype_userId_fkey" TO "Deck_userId_fkey";