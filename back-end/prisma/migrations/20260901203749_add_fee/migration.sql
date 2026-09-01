-- CreateTable
CREATE TABLE `fees` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `paidAmount` DECIMAL(10, 2) NOT NULL,
    `dueDate` DATE NOT NULL,
    `status` ENUM('PENDING', 'PAID', 'PARTIAL', 'OVERDUE') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `fees_studentId_idx`(`studentId`),
    INDEX `fees_dueDate_idx`(`dueDate`),
    INDEX `fees_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `fees` ADD CONSTRAINT `fees_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
