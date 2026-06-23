-- AlterTable
ALTER TABLE "home_content" ADD COLUMN     "bannerAlt" TEXT,
ADD COLUMN     "bannerImage" TEXT,
ADD COLUMN     "bannerImageTitle" TEXT,
ADD COLUMN     "bannerVideo" TEXT,
ADD COLUMN     "heroCtaNewTab" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "showBanner" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showStats" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "home_stats" (
    "id" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "suffix" TEXT NOT NULL DEFAULT '+',
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "home_stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "home_stats_order_idx" ON "home_stats"("order");
