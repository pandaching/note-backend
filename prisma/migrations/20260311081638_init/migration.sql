-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tags" TEXT NOT NULL DEFAULT '',
    "images" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);
