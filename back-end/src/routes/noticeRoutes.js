const express = require("express");

const {
  createNotice,
  getNotices,
  getNoticeById,
  updateNotice,
  deleteNotice,
} = require("../controllers/noticeController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// ==========================================
// GET ALL NOTICES
// ADMIN, TEACHER, PARENT, STUDENT
// ==========================================

router.get(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN", "TEACHER", "PARENT", "STUDENT"),
  getNotices
);

// ==========================================
// GET NOTICE BY ID
// ADMIN, TEACHER, PARENT, STUDENT
// ==========================================

router.get(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN", "TEACHER", "PARENT", "STUDENT"),
  getNoticeById
);

// ==========================================
// CREATE NOTICE
// ADMIN, TEACHER
// ==========================================

router.post(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN", "TEACHER"),
  createNotice
);

// ==========================================
// UPDATE NOTICE
// ADMIN, TEACHER
// ==========================================

router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN", "TEACHER"),
  updateNotice
);

// ==========================================
// DELETE NOTICE
// ADMIN ONLY
// ==========================================

router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  deleteNotice
);

module.exports = router;