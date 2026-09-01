const express = require("express");

const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

// CREATE
router.post("/", createUser);

// GET ALL
router.get("/", getUsers);

// GET BY ID
router.get("/:id", getUserById);

// UPDATE
router.put("/:id", updateUser);

// DELETE
router.delete("/:id", deleteUser);

module.exports = router;