/*
  Warnings:

  - You are about to drop the column `balance_in_cents` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `value_in_cents` on the `Deposit` table. All the data in the column will be lost.
  - You are about to drop the column `investment_value_in_cents` on the `Investment` table. All the data in the column will be lost.
  - Added the required column `balance` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `Deposit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `investment` to the `Investment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Client" DROP COLUMN "balance_in_cents",
ADD COLUMN     "balance" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Deposit" DROP COLUMN "value_in_cents",
ADD COLUMN     "value" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Investment" DROP COLUMN "investment_value_in_cents",
ADD COLUMN     "investment" DOUBLE PRECISION NOT NULL;
