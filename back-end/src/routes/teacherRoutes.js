const express = require("express");

const {
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
} = require("../controllers/teacherController");

const router = express.Router();

// CREATE
router.post("/", createTeacher);

// GET ALL
router.get("/", getTeachers);

// GET BY ID
router.get("/:id", getTeacherById);

// UPDATE
router.put("/:id", updateTeacher);

// DELETE
router.delete("/:id", deleteTeacher);

module.exports = router;