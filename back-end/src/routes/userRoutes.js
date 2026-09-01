const express = require("express");

const {
  createUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// ===============================
// LOGIN - PUBLIC
// ===============================

router.post("/login", loginUser);

// ===============================
// USER CRUD - ADMIN ONLY
// ===============================

// CREATE USER
router.post(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN"),
  createUser
);

// GET ALL USERS
router.get(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN"),
  getUsers
);

// GET USER BY ID
router.get(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  getUserById
);

// UPDATE USER
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  updateUser
);

// DELETE USER
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  deleteUser
);

module.exports = router;