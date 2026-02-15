/*
  Warnings:

  - Made the column `name` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "name" SET NOT NULL;
