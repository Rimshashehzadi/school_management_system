const express = require("express");

const {
  createAttendance,
  getAttendances,
  getAttendanceById,
  getAttendanceByStudent,
  updateAttendance,
  deleteAttendance,
} = require("../controllers/attendanceController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// CREATE ATTENDANCE
router.post(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN", "TEACHER"),
  createAttendance
);

// GET ALL ATTENDANCE
router.get(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN", "TEACHER"),
  getAttendances
);

// GET ATTENDANCE BY STUDENT
router.get(
  "/student/:studentId",
  authMiddleware,
  authorizeRoles("ADMIN", "TEACHER", "PARENT", "STUDENT"),
  getAttendanceByStudent
);

// GET ATTENDANCE BY ID
router.get(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN", "TEACHER", "PARENT", "STUDENT"),
  getAttendanceById
);

// UPDATE ATTENDANCE
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN", "TEACHER"),
  updateAttendance
);

// DELETE ATTENDANCE
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  deleteAttendance
);

module.exports = router;