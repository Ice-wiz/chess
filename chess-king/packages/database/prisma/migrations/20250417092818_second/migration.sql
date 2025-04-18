/*
  Warnings:

  - You are about to drop the column `opening` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `timeControl` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `comments` on the `Move` table. All the data in the column will be lost.
  - Made the column `timeTaken` on table `Move` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "opening",
DROP COLUMN "timeControl",
ALTER COLUMN "status" SET DEFAULT 'IN_PROGRESS';

-- AlterTable
ALTER TABLE "Move" DROP COLUMN "comments",
ALTER COLUMN "timeTaken" SET NOT NULL;

-- DropEnum
DROP TYPE "TimeControl";
