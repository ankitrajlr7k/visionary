-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "prompt" TEXT NOT NULL DEFAULT '';
