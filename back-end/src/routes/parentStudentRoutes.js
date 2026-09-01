const express = require("express");

const {
  addStudentToParent,
  getParentStudents,
  removeStudentFromParent,
} = require("../controllers/parentStudentController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// ==================================================
// ADD STUDENT TO PARENT
// POST /api/parent-students/:parentId/students
// ADMIN ONLY
// ==================================================

router.post(
  "/:parentId/students",
  authMiddleware,
  authorizeRoles("ADMIN"),
  addStudentToParent
);

// ==================================================
// GET ALL STUDENTS OF PARENT
// GET /api/parent-students/:parentId/students
// ADMIN, TEACHER, PARENT
// ==================================================

router.get(
  "/:parentId/students",
  authMiddleware,
  authorizeRoles("ADMIN", "TEACHER", "PARENT"),
  getParentStudents
);

// ==================================================
// REMOVE STUDENT FROM PARENT
// DELETE /api/parent-students/:parentId/students/:studentId
// ADMIN ONLY
// ==================================================

router.delete(
  "/:parentId/students/:studentId",
  authMiddleware,
  authorizeRoles("ADMIN"),
  removeStudentFromParent
);

module.exports = router;