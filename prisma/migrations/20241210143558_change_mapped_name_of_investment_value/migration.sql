/*
  Warnings:

  - You are about to drop the column `investment` on the `Investment` table. All the data in the column will be lost.
  - Added the required column `investment_value` to the `Investment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Investment" DROP COLUMN "investment",
ADD COLUMN     "investment_value" DOUBLE PRECISION NOT NULL;
