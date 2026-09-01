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

router.get(
  "/student/:studentId/exam/:examId",
  getStudentExamResult
);

// ==========================================
// GET RESULT HISTORY FOR STUDENT
// ==========================================

router.get(
  "/student/:studentId/history",
  getStudentResultHistory
);

// ==========================================
// GET REPORT CARD
// ==========================================

router.get(
  "/student/:studentId/exam/:examId/report-card",
  getReportCard
);

module.exports = router;