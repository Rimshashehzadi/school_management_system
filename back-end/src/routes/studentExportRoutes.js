const express = require("express");
const multer = require("multer");

const {
  exportStudentsCsv,
  exportStudentsExcel,
} = require("../controllers/studentExportController");

const {
  importStudents,
} = require("../controllers/studentImportController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.get(
  "/students/csv",
  authMiddleware,
  authorizeRoles("ADMIN", "TEACHER"),
  exportStudentsCsv
);

router.get(
  "/students/excel",
  authMiddleware,
  authorizeRoles("ADMIN", "TEACHER"),
  exportStudentsExcel
);

router.post(
  "/students/import",
  authMiddleware,
  authorizeRoles("ADMIN"),
  upload.single("file"),
  importStudents
);

module.exports = router;