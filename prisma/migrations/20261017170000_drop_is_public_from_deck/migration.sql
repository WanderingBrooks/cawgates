/*
  Warnings:

  - You are about to drop the column `isPublic` on the `Deck` table. All the data in the column will be lost.

*/
-- Every deck is public since PR #70, and nothing has read this column since
-- that deploy (see COLUMNS_TO_DROP.md)
-- AlterTable
ALTER TABLE "Deck" DROP COLUMN "isPublic";
