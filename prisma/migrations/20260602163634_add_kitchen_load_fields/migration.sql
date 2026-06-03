-- AlterTable
ALTER TABLE "Branch" ADD COLUMN     "avgPrepTimeBaseline" INTEGER NOT NULL DEFAULT 15,
ADD COLUMN     "currentLoadLevel" INTEGER NOT NULL DEFAULT 0;
