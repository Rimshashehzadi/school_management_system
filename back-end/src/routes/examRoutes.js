
// const express = require("express");

// const {
//   createExam,
//   getExams,
//   getExamById,
//   updateExam,
//   deleteExam,
// } = require("../controllers/examController");

// const router = express.Router();

// router.post("/", createExam);
// router.get("/", getExams);
// router.get("/:id", getExamById);
// router.put("/:id", updateExam);
// router.delete("/:id", deleteExam);

// module.exports = router;
const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "EXAM ROUTE IS WORKING",
  });
});

module.exports = router;