const express = require("express");

const {
  getExamReport,
} = require("../controllers/examReportController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/:examId",
  authMiddleware,
  authorizeRoles("ADMIN", "TEACHER", "PARENT", "STUDENT"),
  getExamReport
);

module.exports = router;