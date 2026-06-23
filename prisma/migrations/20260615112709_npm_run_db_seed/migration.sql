-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'EDITOR');

-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('UNREAD', 'READ', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ContactSource" AS ENUM ('CONTACT', 'CAREER');

-- CreateEnum
CREATE TYPE "ActivityAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'PUBLISH', 'LOGIN', 'LOGOUT');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'EDITOR',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "refreshTokenHash" TEXT NOT NULL,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" "ActivityAction" NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "summary" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "alt" TEXT,
    "uploadedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "anchor" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "iconDark" TEXT NOT NULL,
    "iconLight" TEXT NOT NULL,
    "tags" TEXT[],
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "case_studies" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "shortDesc" TEXT NOT NULL,
    "tags" TEXT[],
    "heroImage" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "galleryImages" TEXT[],
    "industry" TEXT NOT NULL,
    "headquarters" TEXT NOT NULL,
    "website" TEXT,
    "challengeShortInfo" TEXT NOT NULL,
    "challengeLists" TEXT[],
    "challengeBackground" TEXT NOT NULL,
    "solutionDetails" TEXT NOT NULL,
    "longTermImpactTitle" TEXT NOT NULL,
    "featureGridVariant" TEXT NOT NULL DEFAULT '',
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "ogImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "case_studies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "case_study_solutions" (
    "id" TEXT NOT NULL,
    "caseStudyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subTitle" TEXT NOT NULL,
    "items" TEXT[],
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "case_study_solutions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "case_study_features" (
    "id" TEXT NOT NULL,
    "caseStudyId" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "feature" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "case_study_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "case_study_impacts" (
    "id" TEXT NOT NULL,
    "caseStudyId" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subTitle" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "case_study_impacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimonials" (
    "id" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "photo" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_submissions" (
    "id" TEXT NOT NULL,
    "source" "ContactSource" NOT NULL DEFAULT 'CONTACT',
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT,
    "position" TEXT,
    "status" "ContactStatus" NOT NULL DEFAULT 'UNREAD',
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seo_settings" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "metaTitle" TEXT NOT NULL,
    "metaDescription" TEXT NOT NULL,
    "canonicalUrl" TEXT,
    "ogTitle" TEXT,
    "ogDescription" TEXT,
    "ogImage" TEXT,
    "twitterTitle" TEXT,
    "twitterDescription" TEXT,
    "twitterImage" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seo_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "companyEmail" TEXT NOT NULL,
    "companyPhone" TEXT NOT NULL,
    "addressLines" TEXT[],
    "linkedinUrl" TEXT,
    "footerNote" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "home_content" (
    "id" TEXT NOT NULL DEFAULT 'home',
    "heroTitle" TEXT NOT NULL,
    "heroSubtitle" TEXT NOT NULL,
    "heroCtaLabel" TEXT NOT NULL,
    "heroCtaHref" TEXT NOT NULL,
    "whoEyebrow" TEXT NOT NULL,
    "whoTitle" TEXT NOT NULL,
    "whoParagraphs" TEXT[],
    "whoCtaLabel" TEXT NOT NULL,
    "whoCtaHref" TEXT NOT NULL,
    "statClients" INTEGER NOT NULL,
    "statProjects" INTEGER NOT NULL,
    "statIndustries" INTEGER NOT NULL,
    "servicesEyebrow" TEXT NOT NULL,
    "servicesTitle" TEXT NOT NULL,
    "workEyebrow" TEXT NOT NULL,
    "workTitle" TEXT NOT NULL,
    "clientsEyebrow" TEXT NOT NULL,
    "clientsTitle" TEXT NOT NULL,
    "testimonialsEyebrow" TEXT NOT NULL,
    "testimonialsTitle" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "home_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_content" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "page_content_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_refreshTokenHash_key" ON "sessions"("refreshTokenHash");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

-- CreateIndex
CREATE INDEX "sessions_expiresAt_idx" ON "sessions"("expiresAt");

-- CreateIndex
CREATE INDEX "activity_logs_createdAt_idx" ON "activity_logs"("createdAt");

-- CreateIndex
CREATE INDEX "activity_logs_userId_idx" ON "activity_logs"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "media_filename_key" ON "media"("filename");

-- CreateIndex
CREATE INDEX "media_createdAt_idx" ON "media"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "services_slug_key" ON "services"("slug");

-- CreateIndex
CREATE INDEX "services_order_idx" ON "services"("order");

-- CreateIndex
CREATE INDEX "services_published_idx" ON "services"("published");

-- CreateIndex
CREATE UNIQUE INDEX "case_studies_slug_key" ON "case_studies"("slug");

-- CreateIndex
CREATE INDEX "case_studies_order_idx" ON "case_studies"("order");

-- CreateIndex
CREATE INDEX "case_studies_published_idx" ON "case_studies"("published");

-- CreateIndex
CREATE INDEX "case_study_solutions_caseStudyId_idx" ON "case_study_solutions"("caseStudyId");

-- CreateIndex
CREATE INDEX "case_study_features_caseStudyId_idx" ON "case_study_features"("caseStudyId");

-- CreateIndex
CREATE INDEX "case_study_impacts_caseStudyId_idx" ON "case_study_impacts"("caseStudyId");

-- CreateIndex
CREATE INDEX "testimonials_order_idx" ON "testimonials"("order");

-- CreateIndex
CREATE INDEX "testimonials_published_idx" ON "testimonials"("published");

-- CreateIndex
CREATE INDEX "clients_order_idx" ON "clients"("order");

-- CreateIndex
CREATE INDEX "clients_published_idx" ON "clients"("published");

-- CreateIndex
CREATE INDEX "contact_submissions_status_idx" ON "contact_submissions"("status");

-- CreateIndex
CREATE INDEX "contact_submissions_createdAt_idx" ON "contact_submissions"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "seo_settings_path_key" ON "seo_settings"("path");

-- CreateIndex
CREATE UNIQUE INDEX "page_content_key_key" ON "page_content"("key");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_study_solutions" ADD CONSTRAINT "case_study_solutions_caseStudyId_fkey" FOREIGN KEY ("caseStudyId") REFERENCES "case_studies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_study_features" ADD CONSTRAINT "case_study_features_caseStudyId_fkey" FOREIGN KEY ("caseStudyId") REFERENCES "case_studies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_study_impacts" ADD CONSTRAINT "case_study_impacts_caseStudyId_fkey" FOREIGN KEY ("caseStudyId") REFERENCES "case_studies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
