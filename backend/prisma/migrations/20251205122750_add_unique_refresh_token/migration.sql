/*
  Warnings:

  - A unique constraint covering the columns `[refreshToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `refreshToken` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `refreshToken` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_refreshToken_key` ON `User`(`refreshToken`);
