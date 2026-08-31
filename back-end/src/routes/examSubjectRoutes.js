const express = require("express");

const {
  addExamSubject,
  getExamSubjects,
} = require("../controllers/examSubjectController");

const router = express.Router();

router.post("/:examId/subjects", addExamSubject);
router.get("/:examId/subjects", getExamSubjects);

module.exports = router;