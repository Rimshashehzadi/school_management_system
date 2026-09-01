-- CreateIndex
CREATE INDEX `timetables_classId_day_idx` ON `timetables`(`classId`, `day`);

-- CreateIndex
CREATE INDEX `timetables_teacherId_day_idx` ON `timetables`(`teacherId`, `day`);
