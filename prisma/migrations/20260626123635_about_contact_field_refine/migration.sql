/*
  Warnings:

  - You are about to drop the column `bannerImage` on the `contact_content` table. All the data in the column will be lost.
  - You are about to drop the column `bannerSubtitle` on the `contact_content` table. All the data in the column will be lost.
  - You are about to drop the column `bannerTitle` on the `contact_content` table. All the data in the column will be lost.
  - You are about to drop the column `breadcrumb` on the `contact_content` table. All the data in the column will be lost.
  - You are about to drop the column `showBanner` on the `contact_content` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "about_content" ADD COLUMN     "whyTitle" TEXT;

-- AlterTable
ALTER TABLE "contact_content" DROP COLUMN "bannerImage",
DROP COLUMN "bannerSubtitle",
DROP COLUMN "bannerTitle",
DROP COLUMN "breadcrumb",
DROP COLUMN "showBanner",
ADD COLUMN     "directionsUrl" TEXT,
ADD COLUMN     "formHeading" TEXT,
ADD COLUMN     "formIntro" TEXT,
ADD COLUMN     "locationHeading" TEXT,
ADD COLUMN     "locationTitle" TEXT,
ADD COLUMN     "officeCity" TEXT,
ADD COLUMN     "officeName" TEXT;
