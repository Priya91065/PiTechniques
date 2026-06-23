-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "jobs" (
    "id" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "jobCode" TEXT,
    "department" TEXT,
    "experience" TEXT NOT NULL,
    "location" TEXT,
    "employmentType" TEXT,
    "shortDescription" TEXT,
    "qualifications" TEXT[],
    "responsibilities" JSONB,
    "skills" TEXT[],
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "status" "JobStatus" NOT NULL DEFAULT 'ACTIVE',
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "jobs_slug_key" ON "jobs"("slug");

-- CreateIndex
CREATE INDEX "jobs_status_idx" ON "jobs"("status");

-- CreateIndex
CREATE INDEX "jobs_displayOrder_idx" ON "jobs"("displayOrder");
