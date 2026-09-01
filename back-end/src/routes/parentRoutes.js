
const express = require("express");

const {
  createParent,
  getParents,
  getParentById,
  updateParent,
  deleteParent,
} = require("../controllers/parentController");

const router = express.Router();

// CREATE PARENT
router.post("/", createParent);

// GET ALL PARENTS
router.get("/", getParents);

// GET PARENT BY ID
router.get("/:id", getParentById);

// UPDATE PARENT
router.put("/:id", updateParent);

// DELETE PARENT
router.delete("/:id", deleteParent);

module.exports = router;

