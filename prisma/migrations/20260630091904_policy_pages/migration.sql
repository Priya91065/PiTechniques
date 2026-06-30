-- CreateTable
CREATE TABLE "policy_pages" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "pageClass" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "bannerDescription" TEXT,
    "contentClassName" TEXT NOT NULL DEFAULT 'static-content',
    "contentHtml" TEXT NOT NULL,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoKeywords" TEXT,
    "ogImage" TEXT,
    "status" "PageStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "policy_pages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "policy_pages_slug_key" ON "policy_pages"("slug");
