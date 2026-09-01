/*
  Warnings:

  - You are about to drop the column `date` on the `notices` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `notices` table. All the data in the column will be lost.
  - Added the required column `message` to the `notices` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `notices_date_idx` ON `notices`;

-- AlterTable
ALTER TABLE `notices` DROP COLUMN `date`,
    DROP COLUMN `description`,
    ADD COLUMN `message` TEXT NOT NULL;

-- CreateIndex
CREATE INDEX `notices_createdAt_idx` ON `notices`(`createdAt`);
