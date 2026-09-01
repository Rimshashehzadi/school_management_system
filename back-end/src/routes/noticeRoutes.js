const express = require("express");

const {
  createNotice,
  getNotices,
  getNoticeById,
  updateNotice,
  deleteNotice,
} = require("../controllers/noticeController");

const router = express.Router();

// CREATE
router.post("/", createNotice);

// GET ALL
router.get("/", getNotices);

// GET BY ID
router.get("/:id", getNoticeById);

// UPDATE
router.put("/:id", updateNotice);

// DELETE
router.delete("/:id", deleteNotice);

module.exports = router;