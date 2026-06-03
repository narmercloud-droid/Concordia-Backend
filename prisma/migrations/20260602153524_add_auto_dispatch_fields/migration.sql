-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "assignedAt" TIMESTAMP(3),
ADD COLUMN     "assignmentScore" DOUBLE PRECISION,
ADD COLUMN     "autoAssigned" BOOLEAN NOT NULL DEFAULT false;
