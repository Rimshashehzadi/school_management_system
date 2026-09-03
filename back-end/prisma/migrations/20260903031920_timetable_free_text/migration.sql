/*
  Warnings:

  - You are about to drop the column `createdAt` on the `fees` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `fees` table. All the data in the column will be lost.
  - You are about to drop the column `classId` on the `timetables` table. All the data in the column will be lost.
  - You are about to drop the column `subjectId` on the `timetables` table. All the data in the column will be lost.
  - You are about to drop the column `teacherId` on the `timetables` table. All the data in the column will be lost.
  - Added the required column `className` to the `timetables` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subjectName` to the `timetables` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacherName` to the `timetables` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `timetables` DROP FOREIGN KEY `timetables_classId_fkey`;

-- DropForeignKey
ALTER TABLE `timetables` DROP FOREIGN KEY `timetables_subjectId_fkey`;

-- DropForeignKey
ALTER TABLE `timetables` DROP FOREIGN KEY `timetables_teacherId_fkey`;

-- DropIndex
DROP INDEX `timetables_classId_day_idx` ON `timetables`;

-- DropIndex
DROP INDEX `timetables_classId_idx` ON `timetables`;

-- DropIndex
DROP INDEX `timetables_subjectId_idx` ON `timetables`;

-- DropIndex
DROP INDEX `timetables_teacherId_day_idx` ON `timetables`;

-- DropIndex
DROP INDEX `timetables_teacherId_idx` ON `timetables`;

-- AlterTable
ALTER TABLE `fees` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`;

-- AlterTable
ALTER TABLE `timetables` DROP COLUMN `classId`,
    DROP COLUMN `subjectId`,
    DROP COLUMN `teacherId`,
    ADD COLUMN `className` VARCHAR(191) NOT NULL,
    ADD COLUMN `subjectName` VARCHAR(191) NOT NULL,
    ADD COLUMN `teacherName` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `timetables_className_idx` ON `timetables`(`className`);

-- CreateIndex
CREATE INDEX `timetables_subjectName_idx` ON `timetables`(`subjectName`);

-- CreateIndex
CREATE INDEX `timetables_teacherName_idx` ON `timetables`(`teacherName`);

-- CreateIndex
CREATE INDEX `timetables_className_day_idx` ON `timetables`(`className`, `day`);

-- CreateIndex
CREATE INDEX `timetables_teacherName_day_idx` ON `timetables`(`teacherName`, `day`);
