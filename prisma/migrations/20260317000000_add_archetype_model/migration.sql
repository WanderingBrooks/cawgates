-- CreateTable: Archetype model (user's own deck archetype)
CREATE TABLE "Archetype" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Archetype_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey: Archetype -> User
ALTER TABLE "Archetype" ADD CONSTRAINT "Archetype_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Data migration: create a default "Default" archetype for every existing user
INSERT INTO "Archetype" ("id", "name", "userId", "createdAt")
SELECT gen_random_uuid(), 'Default', "id", NOW()
FROM "User";

-- AddColumn: archetypeId to Event (nullable first so we can populate it)
ALTER TABLE "Event" ADD COLUMN "archetypeId" TEXT;

-- Data migration: assign each event to the default archetype of its owner
UPDATE "Event" e
SET "archetypeId" = a."id"
FROM "Archetype" a
WHERE a."userId" = e."userId";

-- Make archetypeId NOT NULL now that all rows are populated
ALTER TABLE "Event" ALTER COLUMN "archetypeId" SET NOT NULL;

-- AddForeignKey: Event -> Archetype
ALTER TABLE "Event" ADD CONSTRAINT "Event_archetypeId_fkey" FOREIGN KEY ("archetypeId") REFERENCES "Archetype"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropForeignKey: Event -> User (old relation)
ALTER TABLE "Event" DROP CONSTRAINT "Event_userId_fkey";

-- DropColumn: userId from Event
ALTER TABLE "Event" DROP COLUMN "userId";
