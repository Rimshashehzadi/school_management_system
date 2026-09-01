
const express = require("express");

const {
  addStudentToParent,
  getParentStudents,
  removeStudentFromParent,
} = require("../controllers/parentStudentController");

const router = express.Router();

// ==================================================
// ADD STUDENT TO PARENT
// POST /api/parent-students/:parentId/students
// ==================================================

router.post("/:parentId/students", addStudentToParent);

// ==================================================
// GET ALL STUDENTS OF PARENT
// GET /api/parent-students/:parentId/students
// ==================================================

router.get("/:parentId/students", getParentStudents);

// ==================================================
// REMOVE STUDENT FROM PARENT
// DELETE /api/parent-students/:parentId/students/:studentId
// ==================================================

router.delete(
  "/:parentId/students/:studentId",
  removeStudentFromParent
);

module.exports = router;

