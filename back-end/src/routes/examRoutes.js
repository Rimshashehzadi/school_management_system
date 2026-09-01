const express = require("express");

const {
  createExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam,
} = require("../controllers/examController");

const router = express.Router();

// Create exam
router.post("/", createExam);

// Get all exams
router.get("/", getExams);

// Get single exam
router.get("/:id", getExamById);

// Update exam
router.put("/:id", updateExam);

// Delete exam
router.delete("/:id", deleteExam);

module.exports = router;