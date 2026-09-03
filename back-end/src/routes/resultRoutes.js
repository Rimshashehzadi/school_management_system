const express = require("express");

const {
  getStudentExamResult,
  getStudentResultHistory,
  getReportCard,
} = require("../controllers/resultController");

const router = express.Router();

// ==========================================
// GET RESULT FOR STUDENT + EXAM
// ==========================================
// Example:
// GET /api/results/student/1/exam/2

router.get(
  "/student/:studentId/exam/:examId",
  getStudentExamResult
);

// ==========================================
// GET RESULT HISTORY FOR STUDENT
// ==========================================
// Example:
// GET /api/results/student/1/history

router.get(
  "/student/:studentId/history",
  getStudentResultHistory
);

// ==========================================
// GET REPORT CARD
// ==========================================
// Example:
// GET /api/results/student/1/exam/2/report-card

router.get(
  "/student/:studentId/exam/:examId/report-card",
  getReportCard
);

// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;