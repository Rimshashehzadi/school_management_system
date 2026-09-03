const express = require("express");

const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

const router = express.Router();

// ==========================================
// CREATE STUDENT
// POST /api/students
// ==========================================
router.post("/", createStudent);

// ==========================================
// GET ALL STUDENTS
// GET /api/students
// ==========================================
router.get("/", getStudents);

// ==========================================
// GET STUDENT BY ID
// GET /api/students/:id
// ==========================================
router.get("/:id", getStudentById);

// ==========================================
// UPDATE STUDENT
// PUT /api/students/:id
// ==========================================
router.put("/:id", updateStudent);

// ==========================================
// DELETE STUDENT
// DELETE /api/students/:id
// ==========================================
router.delete("/:id", deleteStudent);

module.exports = router;