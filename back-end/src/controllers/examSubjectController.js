const prisma = require("../config/prisma");

const addExamSubject = async (req, res) => {
  try {
    const examId = Number(req.params.examId);

    const {
      subjectId,
      totalMarks,
      passingMarks,
    } = req.body;

    if (!subjectId || totalMarks === undefined || passingMarks === undefined) {
      return res.status(400).json({
        message: "subjectId, totalMarks and passingMarks are required",
      });
    }

    const examSubject = await prisma.examSubject.create({
      data: {
        examId,
        subjectId: Number(subjectId),
        totalMarks: Number(totalMarks),
        passingMarks: Number(passingMarks),
      },
      include: {
        exam: true,
        subject: true,
      },
    });

    res.status(201).json({
      message: "Subject added to exam successfully",
      examSubject,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to add subject to exam",
      error: error.message,
    });
  }
};

const getExamSubjects = async (req, res) => {
  try {
    const examId = Number(req.params.examId);

    const subjects = await prisma.examSubject.findMany({
      where: {
        examId,
      },
      include: {
        subject: true,
      },
    });

    res.json(subjects);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch exam subjects",
      error: error.message,
    });
  }
};

module.exports = {
  addExamSubject,
  getExamSubjects,
};