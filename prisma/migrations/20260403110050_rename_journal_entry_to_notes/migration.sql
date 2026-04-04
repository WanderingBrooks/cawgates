/*
  Warnings:

  - You are about to drop the column `journalEntry` on the `Match` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "journalEntry",
ADD COLUMN     "notes" TEXT;
