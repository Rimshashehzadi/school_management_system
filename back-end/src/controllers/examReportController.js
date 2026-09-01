const prisma = require("../config/prisma");

const getExamReport = async (req, res) => {
  try {
    const examId = parseInt(req.params.examId);

    if (isNaN(examId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid exam ID",
      });
    }

    // Check exam
    const exam = await prisma.exam.findUnique({
      where: {
        id: examId,
      },
    });

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    // Get exam subjects and marks
    const examSubjects = await prisma.examSubject.findMany({
      where: {
        examId,
      },
      include: {
        subject: true,
        marks: {
          include: {
            student: true,
          },
        },
      },
    });

    // Student result calculation
    const studentResults = {};

    examSubjects.forEach((examSubject) => {
      examSubject.marks.forEach((mark) => {
        const studentId = mark.student.id;

        if (!studentResults[studentId]) {
          studentResults[studentId] = {
            studentId,
            studentName: mark.student.name,
            totalMarks: 0,
            totalPossibleMarks: 0,
          };
        }

        studentResults[studentId].totalMarks += Number(mark.obtainedMarks);
        studentResults[studentId].totalPossibleMarks +=
          Number(examSubject.totalMarks);
      });
    });

    const results = Object.values(studentResults).map((result) => {
      const percentage =
        result.totalPossibleMarks > 0
          ? (result.totalMarks / result.totalPossibleMarks) * 100
          : 0;

      return {
        ...result,
        percentage: Number(percentage.toFixed(2)),
        result: percentage >= 40 ? "PASS" : "FAIL",
      };
    });

    const totalStudents = results.length;

    const passedStudents = results.filter(
      (student) => student.result === "PASS"
    ).length;

    const failedStudents = results.filter(
      (student) => student.result === "FAIL"
    ).length;

    const averagePercentage =
      totalStudents > 0
        ? results.reduce(
            (sum, student) => sum + student.percentage,
            0
          ) / totalStudents
        : 0;

    return res.status(200).json({
      success: true,
      message: "Exam report fetched successfully",

      data: {
        exam: {
          id: exam.id,
          name: exam.name,
          startDate: exam.startDate,
          endDate: exam.endDate,
        },

        summary: {
          totalStudents,
          passedStudents,
          failedStudents,
          averagePercentage: Number(averagePercentage.toFixed(2)),
        },

        results,
      },
    });
  } catch (error) {
    console.error("GET EXAM REPORT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch exam report",
      error: error.message,
    });
  }
};

module.exports = {
  getExamReport,
};