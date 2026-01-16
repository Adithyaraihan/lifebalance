/*
  Warnings:

  - You are about to drop the `habitprogress` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `habitprogress` DROP FOREIGN KEY `HabitProgress_habitId_fkey`;

-- AlterTable
ALTER TABLE `habit` ADD COLUMN `done` BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE `habitprogress`;
