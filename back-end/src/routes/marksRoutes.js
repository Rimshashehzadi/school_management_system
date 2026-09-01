
const express = require("express");

const {
  createMarks,
  getMarks,
  getMarksById,
  updateMarks,
  deleteMarks,
} = require("../controllers/marksController");

const router = express.Router();

// ==========================================
// CREATE MARKS
// POST /api/marks
// ==========================================

router.post("/", createMarks);

// ==========================================
// GET ALL MARKS
// GET /api/marks
// ==========================================

router.get("/", getMarks);

// ==========================================
// GET MARKS BY ID
// GET /api/marks/:id
// ==========================================

router.get("/:id", getMarksById);

// ==========================================
// UPDATE MARKS
// PUT /api/marks/:id
// ==========================================

router.put("/:id", updateMarks);

// ==========================================
// DELETE MARKS
// DELETE /api/marks/:id
// ==========================================

router.delete("/:id", deleteMarks);

module.exports = router;

