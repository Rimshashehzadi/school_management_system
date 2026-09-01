const express = require("express");

const {
  createTimetable,
  getTimetables,
  getTimetableById,
  getTimetableByClass,
  getTimetableByTeacher,
  updateTimetable,
  deleteTimetable,
} = require("../controllers/timetableController");

const router = express.Router();

// ==========================================
// CREATE TIMETABLE
// POST /api/timetables
// ==========================================

router.post("/", createTimetable);

// ==========================================
// GET ALL TIMETABLES
// GET /api/timetables
// ==========================================

router.get("/", getTimetables);

// ==========================================
// GET TIMETABLE BY CLASS
// GET /api/timetables/class/:classId
// ==========================================

router.get("/class/:classId", getTimetableByClass);

// ==========================================
// GET TIMETABLE BY TEACHER
// GET /api/timetables/teacher/:teacherId
// ==========================================

router.get("/teacher/:teacherId", getTimetableByTeacher);

// ==========================================
// GET TIMETABLE BY ID
// GET /api/timetables/:id
// ==========================================

router.get("/:id", getTimetableById);

// ==========================================
// UPDATE TIMETABLE
// PUT /api/timetables/:id
// ==========================================

router.put("/:id", updateTimetable);

// ==========================================
// DELETE TIMETABLE
// DELETE /api/timetables/:id
// ==========================================

router.delete("/:id", deleteTimetable);

module.exports = router;