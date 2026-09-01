const prisma = require("../config/prisma");

// GET STUDENT REPORT
const getStudentReport = async (req, res) => {
  try {
    const studentId = parseInt(req.params.studentId);

    if (isNaN(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    // Find student
    const student = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Get student's marks
  const marks = await prisma.mark.findMany({
  where: {
    studentId: studentId,
  },
  include: {
    examSubject: {
      include: {
        exam: true,
        subject: true,
      },
    },
  },
  orderBy: {
    id: "asc",
  },
});
    // Total obtained marks
    const totalMarks = marks.reduce(
      (total, mark) => total + Number(mark.obtainedMarks),
      0
    );

    // Total possible marks
    const totalPossibleMarks = marks.reduce(
      (total, mark) =>
        total + Number(mark.examSubject?.totalMarks || 100),
      0
    );

    // Percentage
    const percentage =
      totalPossibleMarks > 0
        ? Number(((totalMarks / totalPossibleMarks) * 100).toFixed(2))
        : 0;

    // Result
    const result = percentage >= 40 ? "PASS" : "FAIL";

    return res.status(200).json({
      success: true,
      message: "Student report fetched successfully",
      data: {
        student,
        summary: {
          totalSubjects: marks.length,
          totalMarks,
          totalPossibleMarks,
          percentage,
          result,
        },
        marks,
      },
    });
  } catch (error) {
    console.error("STUDENT REPORT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch student report",
      error: error.message,
    });
  }
};

module.exports = {
  getStudentReport,
};