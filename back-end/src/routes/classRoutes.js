const express = require("express");

const {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass,
} = require("../controllers/classController");

const router = express.Router();

// CREATE
router.post("/", createClass);

// GET ALL
router.get("/", getClasses);

// GET BY ID
router.get("/:id", getClassById);

// UPDATE
router.put("/:id", updateClass);

// DELETE
router.delete("/:id", deleteClass);

module.exports = router;