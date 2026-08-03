CREATE TABLE "ProfilePhoto" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "imageBytes" BYTEA NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileName" TEXT,
    "altText" TEXT NOT NULL DEFAULT 'Portrait photo of Gregory Barmpas',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfilePhoto_pkey" PRIMARY KEY ("id")
);
