-- AlterTable
ALTER TABLE "case_studies" ADD COLUMN     "cardClient" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "cardImage" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "cardImageMobile" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "listHeading" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "listImage" TEXT NOT NULL DEFAULT '';
