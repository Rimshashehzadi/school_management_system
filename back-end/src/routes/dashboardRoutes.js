const express = require("express");

const {
  getDashboardStats,
} = require("../controllers/dashboardController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// ==================================================
// GET DASHBOARD STATISTICS
// GET /api/dashboard/stats
// ADMIN ONLY
// ==================================================

router.get(
  "/stats",
  authMiddleware,
  authorizeRoles("ADMIN"),
  getDashboardStats
);

module.exports = router;