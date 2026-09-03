const prisma = require("../config/prisma");

// ==========================================
// GRADE CALCULATION
// ==========================================

const calculateGrade = (percentage) => {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  if (percentage >= 40) return "E";

  return "F";
};

// ==========================================
// GET RESULT FOR STUDENT + EXAM
// ==========================================

const getStudentExamResult = async (req, res) => {
  try {
    const studentId = Number(req.params.studentId);
    const examId = Number(req.params.examId);

    // Validation
    if (!Number.isInteger(studentId) || !Number.isInteger(examId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid studentId or examId",
      });
    }

    // ==========================================
    // FIND STUDENT
    // ==========================================

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

    // ==========================================
    // FIND EXAM
    // ==========================================

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

    // ==========================================
    // GET MARKS
    // ==========================================

    const marks = await prisma.mark.findMany({
      where: {
        studentId: studentId,

        examSubject: {
          examId: examId,
        },
      },

      include: {
        examSubject: {
          include: {
            subject: true,
          },
        },
      },

      orderBy: {
        id: "asc",
      },
    });

    if (marks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No marks found for this student and exam",
      });
    }

    // ==========================================
    // CALCULATE TOTALS
    // ==========================================

    let totalMarks = 0;
    let obtainedMarks = 0;

    // ==========================================
    // SUBJECT-WISE RESULT
    // ==========================================

    const subjects = marks.map((mark) => {
      const total = Number(mark.examSubject.totalMarks);
      const obtained = Number(mark.obtainedMarks);
      const passing = Number(mark.examSubject.passingMarks);

      totalMarks += total;
      obtainedMarks += obtained;

      const percentage =
        total > 0
          ? Number(((obtained / total) * 100).toFixed(2))
          : 0;

      const status =
        obtained >= passing ? "PASS" : "FAIL";

      return {
        subjectId: mark.examSubject.subject.id,
        subjectName: mark.examSubject.subject.name,
        subjectCode: mark.examSubject.subject.code,

        obtainedMarks: obtained,
        totalMarks: total,
        passingMarks: passing,

        percentage,
        status,
      };
    });

    // ==========================================
    // OVERALL RESULT
    // ==========================================

    const overallPercentage =
      totalMarks > 0
        ? Number(
            ((obtainedMarks / totalMarks) * 100).toFixed(2)
          )
        : 0;

    const grade = calculateGrade(overallPercentage);

    const overallStatus = subjects.every(
      (subject) => subject.status === "PASS"
    )
      ? "PASS"
      : "FAIL";

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,

      data: {
        student: {
          id: student.id,
          name: student.name,
          email: student.email,
        },

        exam: {
          id: exam.id,
          name: exam.name,
          startDate: exam.startDate,
          endDate: exam.endDate,
        },

        subjects,

        summary: {
          totalSubjects: subjects.length,
          totalMarks,
          obtainedMarks,
          percentage: overallPercentage,
          grade,
          status: overallStatus,
        },
      },
    });
  } catch (error) {
    console.error(
      "Get Student Exam Result Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to calculate result",
      error: error.message,
    });
  }
};

// ==========================================
// GET RESULT HISTORY BY STUDENT
// ==========================================

const getStudentResultHistory = async (req, res) => {
  try {
    const studentId = Number(req.params.studentId);

    // Validation
    if (!Number.isInteger(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid studentId",
      });
    }

    // ==========================================
    // FIND STUDENT
    // ==========================================

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

    // ==========================================
    // GET ALL MARKS
    // ==========================================

    const marks = await prisma.mark.findMany({
      where: {
        studentId,
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
        createdAt: "desc",
      },
    });

    // ==========================================
    // GROUP MARKS BY EXAM
    // ==========================================

    const examMap = {};

    marks.forEach((mark) => {
      const exam = mark.examSubject.exam;

      if (!examMap[exam.id]) {
        examMap[exam.id] = {
          exam: {
            id: exam.id,
            name: exam.name,
            startDate: exam.startDate,
            endDate: exam.endDate,
          },

          totalMarks: 0,
          obtainedMarks: 0,

          subjects: [],
        };
      }

      const examResult = examMap[exam.id];

      const total = Number(
        mark.examSubject.totalMarks
      );

      const obtained = Number(
        mark.obtainedMarks
      );

      const passing = Number(
        mark.examSubject.passingMarks
      );

      examResult.totalMarks += total;
      examResult.obtainedMarks += obtained;

      examResult.subjects.push({
        subjectId: mark.examSubject.subject.id,

        subjectName:
          mark.examSubject.subject.name,

        obtainedMarks: obtained,
        totalMarks: total,
        passingMarks: passing,

        status:
          obtained >= passing
            ? "PASS"
            : "FAIL",
      });
    });

    // ==========================================
    // CREATE HISTORY
    // ==========================================

    const history = Object.values(examMap).map(
      (result) => {
        const percentage =
          result.totalMarks > 0
            ? Number(
                (
                  (result.obtainedMarks /
                    result.totalMarks) *
                  100
                ).toFixed(2)
              )
            : 0;

        const status = result.subjects.every(
          (subject) =>
            subject.status === "PASS"
        )
          ? "PASS"
          : "FAIL";

        return {
          exam: result.exam,

          totalSubjects:
            result.subjects.length,

          totalMarks:
            result.totalMarks,

          obtainedMarks:
            result.obtainedMarks,

          percentage,

          grade: calculateGrade(percentage),

          status,
        };
      }
    );

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,

      student: {
        id: student.id,
        name: student.name,
        email: student.email,
      },

      count: history.length,

      data: history,
    });
  } catch (error) {
    console.error(
      "Get Result History Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to get result history",
      error: error.message,
    });
  }
};

// ==========================================
// GET REPORT CARD
// ==========================================

const getReportCard = async (req, res) => {
  try {
    const studentId = Number(req.params.studentId);
    const examId = Number(req.params.examId);

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!Number.isInteger(studentId) || !Number.isInteger(examId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid studentId or examId",
      });
    }

    // ==========================================
    // FIND STUDENT
    // ==========================================

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

    // ==========================================
    // FIND EXAM
    // ==========================================

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

    // ==========================================
    // GET MARKS
    // ==========================================

    const marks = await prisma.mark.findMany({
      where: {
        studentId,

        examSubject: {
          examId,
        },
      },

      include: {
        examSubject: {
          include: {
            subject: true,
          },
        },
      },

      orderBy: {
        id: "asc",
      },
    });

    if (marks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No marks found for report card",
      });
    }

    // ==========================================
    // CALCULATE TOTALS
    // ==========================================

    let totalMarks = 0;
    let obtainedMarks = 0;

    // ==========================================
    // SUBJECTS
    // ==========================================

    const subjects = marks.map((mark) => {
      const total = Number(
        mark.examSubject.totalMarks
      );

      const obtained = Number(
        mark.obtainedMarks
      );

      const passing = Number(
        mark.examSubject.passingMarks
      );

      totalMarks += total;
      obtainedMarks += obtained;

      return {
        subject:
          mark.examSubject.subject.name,

        code:
          mark.examSubject.subject.code,

        totalMarks: total,

        passingMarks: passing,

        obtainedMarks: obtained,

        status:
          obtained >= passing
            ? "PASS"
            : "FAIL",
      };
    });

    // ==========================================
    // FINAL RESULT
    // ==========================================

    const percentage =
      totalMarks > 0
        ? Number(
            (
              (obtainedMarks /
                totalMarks) *
              100
            ).toFixed(2)
          )
        : 0;

    const grade =
      calculateGrade(percentage);

    const status = subjects.every(
      (subject) =>
        subject.status === "PASS"
    )
      ? "PASS"
      : "FAIL";

    // ==========================================
    // REPORT CARD RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,

      reportCard: {
        student: {
          id: student.id,
          name: student.name,
          email: student.email,
        },

        exam: {
          id: exam.id,
          name: exam.name,
          startDate: exam.startDate,
          endDate: exam.endDate,
        },

        subjects,

        result: {
          totalSubjects:
            subjects.length,

          totalMarks,

          obtainedMarks,

          percentage,

          grade,

          status,
        },
      },
    });
  } catch (error) {
    console.error(
      "Get Report Card Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to generate report card",
      error: error.message,
    });
  }
};

// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {
  getStudentExamResult,
  getStudentResultHistory,
  getReportCard,
};