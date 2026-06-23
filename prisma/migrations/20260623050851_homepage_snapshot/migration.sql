-- CreateTable
CREATE TABLE "homepage_snapshots" (
    "id" TEXT NOT NULL DEFAULT 'published',
    "data" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "homepage_snapshots_pkey" PRIMARY KEY ("id")
);
