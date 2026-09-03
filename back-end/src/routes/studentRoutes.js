
const express = require("express");
const multer = require("multer");

const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  importStudents,
} = require("../controllers/studentController");

const router = express.Router();

// ==========================================
// MULTER CONFIGURATION
// Store uploaded CSV in memory
// ==========================================
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter: (req, file, cb) => {
    const isCSV =
      file.mimetype === "text/csv" ||
      file.originalname.toLowerCase().endsWith(".csv");

    if (!isCSV) {
      return cb(new Error("Only CSV files are allowed"));
    }

    cb(null, true);
  },
});

// ==========================================
// CREATE STUDENT
// POST /api/students
// ==========================================
router.post("/", createStudent);

// ==========================================
// IMPORT STUDENTS FROM CSV
// POST /api/students/import
// ==========================================
router.post("/import", upload.single("file"), importStudents);

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

