/*
  Warnings:

  - A unique constraint covering the columns `[userId,name]` on the table `Archetype` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,slug]` on the table `Archetype` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Archetype` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- Add as nullable first so the backfill UPDATE can run before the NOT NULL constraint is enforced.
ALTER TABLE "Archetype" ADD COLUMN "slug" TEXT;

-- Backfill existing archetypes with a hardcoded slug.
-- There is only one archetype in production ("Cawgates"), so this is safe to hardcode.
UPDATE "Archetype" SET "slug" = 'cawgates';

ALTER TABLE "Archetype" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Archetype_userId_name_key" ON "Archetype"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Archetype_userId_slug_key" ON "Archetype"("userId", "slug");
