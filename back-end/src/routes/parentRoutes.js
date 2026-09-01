const express = require("express");

const {
  createParent,
  getParents,
  getParentById,
  updateParent,
  deleteParent,
} = require("../controllers/parentController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// ==========================================
// CREATE PARENT
// ADMIN ONLY
// ==========================================

router.post(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN"),
  createParent
);

// ==========================================
// GET ALL PARENTS
// ADMIN, TEACHER
// ==========================================

router.get(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN", "TEACHER"),
  getParents
);

// ==========================================
// GET PARENT BY ID
// ADMIN, TEACHER
// ==========================================

router.get(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN", "TEACHER"),
  getParentById
);

// ==========================================
// UPDATE PARENT
// ADMIN ONLY
// ==========================================

router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  updateParent
);

// ==========================================
// DELETE PARENT
// ADMIN ONLY
// ==========================================

router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  deleteParent
);

module.exports = router;