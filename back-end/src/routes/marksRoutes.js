const express = require("express");

const {
  createMark,
} = require("../controllers/marksController");

const router = express.Router();

router.post("/", createMark);

module.exports = router;