-- CreateTable
CREATE TABLE "SiteContent" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "heroStatus" TEXT NOT NULL,
    "heroName" TEXT NOT NULL,
    "heroLocation" TEXT NOT NULL,
    "heroTitle" TEXT NOT NULL,
    "heroSubtitle" TEXT NOT NULL,
    "aboutTitle" TEXT NOT NULL,
    "aboutSummary" TEXT NOT NULL,
    "aboutHighlights" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExperienceEntry" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "dates" TEXT NOT NULL,
    "current" BOOLEAN NOT NULL DEFAULT false,
    "bullets" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sortOrder" INTEGER NOT NULL DEFAULT 100,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExperienceEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EducationEntry" (
    "id" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "school" TEXT NOT NULL,
    "dates" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 100,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EducationEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ExperienceEntry_sortOrder_idx" ON "ExperienceEntry"("sortOrder");

-- CreateIndex
CREATE INDEX "EducationEntry_sortOrder_idx" ON "EducationEntry"("sortOrder");
