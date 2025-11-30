-- Convert all vacation camps to day camps
UPDATE "camps" SET "type" = 'day' WHERE "type" = 'vacation';

-- Add a default borough for any camps that don't have one (shouldn't happen after conversion, but just in case)
UPDATE "camps" SET "borough" = 'Ville-Marie' WHERE "borough" IS NULL;

-- Make borough required (not null)
ALTER TABLE "camps" ALTER COLUMN "borough" SET NOT NULL;

-- Remove the type column
ALTER TABLE "camps" DROP COLUMN "type";

