CREATE TABLE "LandingAvatar" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "imageBytes" BYTEA NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileName" TEXT,
    "altText" TEXT NOT NULL DEFAULT 'Portrait avatar of Gregory Barmpas',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LandingAvatar_pkey" PRIMARY KEY ("id")
);
