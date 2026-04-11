-- Add column to indicate if an archetype is public or private
-- Public meaning that other users can view, but not edit it.
ALTER TABLE "Archetype" ADD COLUMN "isPublic" BOOLEAN NOT NULL DEFAULT false;
