const express = require("express");

const {
  getStudentReport,
} = require("../controllers/studentReportController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// =====================================
// GET STUDENT REPORT
// ADMIN / TEACHER / PARENT / STUDENT
// =====================================

router.get(
  "/:studentId",
  authMiddleware,
  authorizeRoles("ADMIN", "TEACHER", "PARENT", "STUDENT"),
  getStudentReport
);

module.exports = router;