const express = require("express");

const {
  getAttendanceReport,
} = require("../controllers/attendanceReportController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// GET STUDENT ATTENDANCE REPORT
router.get(
  "/:studentId",
  authMiddleware,
  authorizeRoles("ADMIN", "TEACHER", "PARENT", "STUDENT"),
  getAttendanceReport
);

module.exports = router;