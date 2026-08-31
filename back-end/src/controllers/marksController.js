const prisma = require("../config/prisma");

const createMark = async (req, res) => {
  try {
    const {
      studentId,
      examSubjectId,
      obtainedMarks,
    } = req.body;

    if (
      !studentId ||
      !examSubjectId ||
      obtainedMarks === undefined
    ) {
      return res.status(400).json({
        message:
          "studentId, examSubjectId and obtainedMarks are required",
      });
    }

    const examSubject = await prisma.examSubject.findUnique({
      where: {
        id: Number(examSubjectId),
      },
    });

    if (!examSubject) {
      return res.status(404).json({
        message: "Exam subject not found",
      });
    }

    const obtained = Number(obtainedMarks);

    if (obtained < 0 || obtained > examSubject.totalMarks) {
      return res.status(400).json({
        message: `Marks must be between 0 and ${examSubject.totalMarks}`,
      });
    }

    const mark = await prisma.mark.create({
      data: {
        studentId: Number(studentId),
        examSubjectId: Number(examSubjectId),
        obtainedMarks: obtained,
      },
    });

    res.status(201).json({
      message: "Marks added successfully",
      mark,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to add marks",
      error: error.message,
    });
  }
};

module.exports = {
  createMark,
};