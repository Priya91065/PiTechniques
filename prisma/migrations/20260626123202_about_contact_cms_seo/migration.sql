-- AlterTable
ALTER TABLE "case_studies" ADD COLUMN     "canonicalUrl" TEXT,
ADD COLUMN     "robotsMeta" TEXT,
ADD COLUMN     "seoKeywords" TEXT,
ADD COLUMN     "twitterImage" TEXT;

-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "canonicalUrl" TEXT,
ADD COLUMN     "robotsMeta" TEXT,
ADD COLUMN     "seoKeywords" TEXT,
ADD COLUMN     "twitterImage" TEXT;

-- AlterTable
ALTER TABLE "services" ADD COLUMN     "canonicalUrl" TEXT,
ADD COLUMN     "ogImage" TEXT,
ADD COLUMN     "robotsMeta" TEXT,
ADD COLUMN     "seoDescription" TEXT,
ADD COLUMN     "seoKeywords" TEXT,
ADD COLUMN     "seoTitle" TEXT,
ADD COLUMN     "twitterImage" TEXT;

-- CreateTable
CREATE TABLE "about_content" (
    "id" TEXT NOT NULL DEFAULT 'about',
    "bannerTitle" TEXT NOT NULL,
    "bannerSubtitle" TEXT,
    "bannerImage" TEXT,
    "breadcrumb" TEXT,
    "ctaLabel" TEXT,
    "ctaHref" TEXT,
    "showBanner" BOOLEAN NOT NULL DEFAULT true,
    "introEyebrow" TEXT,
    "introTitle" TEXT NOT NULL,
    "introDescription" TEXT NOT NULL,
    "introImage" TEXT,
    "introCtaLabel" TEXT,
    "introCtaHref" TEXT,
    "whyHeading" TEXT,
    "whyDescription" TEXT,
    "whyImage" TEXT,
    "showWhySection" BOOLEAN NOT NULL DEFAULT true,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoKeywords" TEXT,
    "canonicalUrl" TEXT,
    "ogImage" TEXT,
    "twitterImage" TEXT,
    "robotsMeta" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "about_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "about_snapshots" (
    "id" TEXT NOT NULL DEFAULT 'published',
    "data" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "about_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "value_cards" (
    "id" TEXT NOT NULL,
    "icon" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "value_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timeline_items" (
    "id" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "timeline_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "why_choose_features" (
    "id" TEXT NOT NULL,
    "icon" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "why_choose_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_content" (
    "id" TEXT NOT NULL DEFAULT 'contact',
    "bannerTitle" TEXT NOT NULL,
    "bannerSubtitle" TEXT,
    "bannerImage" TEXT,
    "breadcrumb" TEXT,
    "showBanner" BOOLEAN NOT NULL DEFAULT true,
    "officeAddress" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "workingHours" TEXT,
    "formTitle" TEXT,
    "formDescription" TEXT,
    "successMessage" TEXT,
    "errorMessage" TEXT,
    "mapEmbedUrl" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoKeywords" TEXT,
    "canonicalUrl" TEXT,
    "ogImage" TEXT,
    "twitterImage" TEXT,
    "robotsMeta" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_snapshots" (
    "id" TEXT NOT NULL DEFAULT 'published',
    "data" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_links" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "social_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "office_locations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "mapUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "office_locations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "value_cards_order_idx" ON "value_cards"("order");

-- CreateIndex
CREATE INDEX "timeline_items_order_idx" ON "timeline_items"("order");

-- CreateIndex
CREATE INDEX "why_choose_features_order_idx" ON "why_choose_features"("order");

-- CreateIndex
CREATE INDEX "social_links_order_idx" ON "social_links"("order");

-- CreateIndex
CREATE INDEX "office_locations_order_idx" ON "office_locations"("order");
