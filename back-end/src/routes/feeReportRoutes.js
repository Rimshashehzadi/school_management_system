const express = require("express");

const {
  getFeeReport,
} = require("../controllers/feeReportController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/:studentId",
  authMiddleware,
  authorizeRoles("ADMIN", "TEACHER", "PARENT", "STUDENT"),
  getFeeReport
);

module.exports = router;