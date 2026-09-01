const express = require("express");

const {
  createExamSubject,
  getExamSubjects,
  getExamSubjectById,
  updateExamSubject,
  deleteExamSubject,
} = require("../controllers/examSubjectController");

const router = express.Router();

// Create exam subject
router.post("/", createExamSubject);

// Get all exam subjects
router.get("/", getExamSubjects);

// Get exam subject by ID
router.get("/:id", getExamSubjectById);

// Update exam subject
router.put("/:id", updateExamSubject);

// Delete exam subject
router.delete("/:id", deleteExamSubject);

module.exports = router;