/*
  Warnings:

  - You are about to drop the column `geoJson` on the `DeliveryZone` table. All the data in the column will be lost.
  - Added the required column `minOrder` to the `DeliveryZone` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DeliveryZone" DROP COLUMN "geoJson",
ADD COLUMN     "minOrder" DOUBLE PRECISION NOT NULL;
