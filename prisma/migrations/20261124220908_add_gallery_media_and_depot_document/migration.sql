-- CreateEnum
CREATE TYPE "GalleryMediaType" AS ENUM ('PHOTO', 'VIDEO');

-- CreateTable
CREATE TABLE "GalleryMedia" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "GalleryMediaType" NOT NULL DEFAULT 'PHOTO',
    "imageUrl" TEXT,
    "videoUrl" TEXT,
    "thumbnailUrl" TEXT,
    "category" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GalleryMedia_pkey" PRIMARY KEY ("id")
);

-- Preserve existing GalleryImage rows as PHOTO-type GalleryMedia before dropping the old table.
INSERT INTO "GalleryMedia" ("id", "title", "type", "imageUrl", "category", "order", "isPublished", "createdAt", "updatedAt")
SELECT "id", "title", 'PHOTO', "imageUrl", "category", 0, true, "createdAt", "createdAt"
FROM "GalleryImage";

-- DropTable
DROP TABLE "GalleryImage";

-- CreateTable
CREATE TABLE "DepotDocument" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "storedFileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "category" TEXT,
    "uploadedById" TEXT,
    "uploadedByName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DepotDocument_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DepotDocument" ADD CONSTRAINT "DepotDocument_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "TeamMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;
