const express = require("express");

const {
  createSubject,
  getSubjects,
  getSubjectById,
} = require("../controllers/subjectController");

const router = express.Router();

// Create subject
router.post("/", createSubject);

// Get all subjects
router.get("/", getSubjects);

// Get subject by ID
router.get("/:id", getSubjectById);

module.exports = router;