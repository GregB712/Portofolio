-- GitHub watchers (subscribers), kept separate from on-site viewCount
ALTER TABLE "Project" ADD COLUMN "watchers" INTEGER;

-- "featured" is now derived from priority order, not a status
UPDATE "Project" SET "status" = 'active' WHERE "status" = 'featured';

-- Featured = first 6 non-hidden projects by priority
UPDATE "Project" SET "featured" = "id" IN (
  SELECT "id" FROM "Project"
  WHERE "status" <> 'hidden'
  ORDER BY "priority" ASC, "createdAt" ASC
  LIMIT 6
);
