const express = require("express");

const {
  createFee,
  getFees,
  getFeeById,
  getFeesByStudent,
  updateFee,
  deleteFee,
} = require("../controllers/feeController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// CREATE FEE
router.post(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN"),
  createFee
);

// GET ALL FEES
router.get(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN", "TEACHER"),
  getFees
);

// GET FEES BY STUDENT
router.get(
  "/student/:studentId",
  authMiddleware,
  authorizeRoles("ADMIN", "TEACHER", "PARENT", "STUDENT"),
  getFeesByStudent
);

// GET FEE BY ID
router.get(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN", "TEACHER", "PARENT", "STUDENT"),
  getFeeById
);

// UPDATE FEE
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  updateFee
);

// DELETE FEE
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  deleteFee
);

module.exports = router;