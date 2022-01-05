-- CreateTable
CREATE TABLE "Award" (
    "id" TEXT NOT NULL,
    "award" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "priority" INTEGER NOT NULL,

    CONSTRAINT "Award_pkey" PRIMARY KEY ("id")
);
