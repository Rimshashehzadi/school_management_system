const prisma = require("../config/prisma");

// ==========================================
// CREATE MARKS
// POST /api/marks
// ==========================================
const createMarks = async (req, res) => {
  try {
    const {
      examId,
      studentId,
      subjectId,
      obtainedMarks,
    } = req.body;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (
      examId === undefined ||
      studentId === undefined ||
      subjectId === undefined ||
      obtainedMarks === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "examId, studentId, subjectId and obtainedMarks are required",
      });
    }

    const examIdNumber = Number(examId);
    const studentIdNumber = Number(studentId);
    const subjectIdNumber = Number(subjectId);
    const obtainedMarksNumber = Number(obtainedMarks);

    if (
      !Number.isInteger(examIdNumber) ||
      !Number.isInteger(studentIdNumber) ||
      !Number.isInteger(subjectIdNumber) ||
      Number.isNaN(obtainedMarksNumber)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid examId, studentId, subjectId or obtainedMarks",
      });
    }

    if (obtainedMarksNumber < 0) {
      return res.status(400).json({
        success: false,
        message: "Obtained marks cannot be negative",
      });
    }

    // ==========================================
    // CHECK EXAM
    // ==========================================

    const exam = await prisma.exam.findUnique({
      where: {
        id: examIdNumber,
      },
    });

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    // ==========================================
    // CHECK STUDENT
    // ==========================================

    const student = await prisma.student.findUnique({
      where: {
        id: studentIdNumber,
      },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // ==========================================
    // CHECK SUBJECT
    // ==========================================

    const subject = await prisma.subject.findUnique({
      where: {
        id: subjectIdNumber,
      },
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    // ==========================================
    // FIND EXAM SUBJECT
    // ==========================================

    const examSubject = await prisma.examSubject.findUnique({
      where: {
        examId_subjectId: {
          examId: examIdNumber,
          subjectId: subjectIdNumber,
        },
      },
    });

    if (!examSubject) {
      return res.status(404).json({
        success: false,
        message: "This subject is not assigned to this exam",
      });
    }

    // ==========================================
    // CHECK TOTAL MARKS
    // ==========================================

    if (
      obtainedMarksNumber >
      Number(examSubject.totalMarks)
    ) {
      return res.status(400).json({
        success: false,
        message: `Obtained marks cannot be greater than ${examSubject.totalMarks}`,
      });
    }

    // ==========================================
    // CHECK DUPLICATE
    // ==========================================

    const existingMarks = await prisma.mark.findUnique({
      where: {
        studentId_examSubjectId: {
          studentId: studentIdNumber,
          examSubjectId: examSubject.id,
        },
      },
    });

    if (existingMarks) {
      return res.status(409).json({
        success: false,
        message:
          "Marks already exist for this student and exam subject",
      });
    }

    // ==========================================
    // CREATE MARK
    // ==========================================

    const marks = await prisma.mark.create({
      data: {
        studentId: studentIdNumber,
        examSubjectId: examSubject.id,
        obtainedMarks: obtainedMarksNumber,
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        examSubject: {
          include: {
            exam: true,
            subject: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Marks created successfully",
      data: marks,
    });
  } catch (error) {
    console.error("Create Marks Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create marks",
      error: error.message,
    });
  }
};

// ==========================================
// GET ALL MARKS
// GET /api/marks
// ==========================================
const getMarks = async (req, res) => {
  try {
    const marks = await prisma.mark.findMany({
      orderBy: {
        id: "desc",
      },

      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        examSubject: {
          include: {
            exam: {
              select: {
                id: true,
                name: true,
                startDate: true,
                endDate: true,
              },
            },

            subject: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      count: marks.length,
      data: marks,
    });
  } catch (error) {
    console.error("Get Marks Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get marks",
      error: error.message,
    });
  }
};

// ==========================================
// GET MARKS BY ID
// GET /api/marks/:id
// ==========================================
const getMarksById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid marks ID",
      });
    }

    const marks = await prisma.mark.findUnique({
      where: {
        id,
      },

      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        examSubject: {
          include: {
            exam: {
              select: {
                id: true,
                name: true,
                startDate: true,
                endDate: true,
              },
            },

            subject: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
        },
      },
    });

    if (!marks) {
      return res.status(404).json({
        success: false,
        message: "Marks not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: marks,
    });
  } catch (error) {
    console.error("Get Marks By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get marks",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE MARKS
// PUT /api/marks/:id
// ==========================================
const updateMarks = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid marks ID",
      });
    }

    // ==========================================
    // FIND EXISTING MARK
    // ==========================================

    const existingMarks = await prisma.mark.findUnique({
      where: {
        id,
      },
    });

    if (!existingMarks) {
      return res.status(404).json({
        success: false,
        message: "Marks not found",
      });
    }

    const {
      examId,
      studentId,
      subjectId,
      obtainedMarks,
    } = req.body;

    // ==========================================
    // CURRENT VALUES
    // ==========================================

    let finalStudentId = existingMarks.studentId;
    let finalExamSubjectId = existingMarks.examSubjectId;

    // ==========================================
    // UPDATE STUDENT
    // ==========================================

    if (studentId !== undefined) {
      const studentIdNumber = Number(studentId);

      if (!Number.isInteger(studentIdNumber)) {
        return res.status(400).json({
          success: false,
          message: "Invalid studentId",
        });
      }

      const student = await prisma.student.findUnique({
        where: {
          id: studentIdNumber,
        },
      });

      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found",
        });
      }

      finalStudentId = studentIdNumber;
    }

    // ==========================================
    // UPDATE EXAM / SUBJECT
    // ==========================================

    if (
      examId !== undefined ||
      subjectId !== undefined
    ) {
      const currentExamSubject =
        await prisma.examSubject.findUnique({
          where: {
            id: existingMarks.examSubjectId,
          },
        });

      const finalExamId =
        examId !== undefined
          ? Number(examId)
          : currentExamSubject.examId;

      const finalSubjectId =
        subjectId !== undefined
          ? Number(subjectId)
          : currentExamSubject.subjectId;

      if (
        !Number.isInteger(finalExamId) ||
        !Number.isInteger(finalSubjectId)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid examId or subjectId",
        });
      }

      // Check exam

      const exam = await prisma.exam.findUnique({
        where: {
          id: finalExamId,
        },
      });

      if (!exam) {
        return res.status(404).json({
          success: false,
          message: "Exam not found",
        });
      }

      // Check subject

      const subject = await prisma.subject.findUnique({
        where: {
          id: finalSubjectId,
        },
      });

      if (!subject) {
        return res.status(404).json({
          success: false,
          message: "Subject not found",
        });
      }

      // Find exam subject

      const newExamSubject =
        await prisma.examSubject.findUnique({
          where: {
            examId_subjectId: {
              examId: finalExamId,
              subjectId: finalSubjectId,
            },
          },
        });

      if (!newExamSubject) {
        return res.status(404).json({
          success: false,
          message:
            "This subject is not assigned to this exam",
        });
      }

      finalExamSubjectId = newExamSubject.id;
    }

    // ==========================================
    // VALIDATE OBTAINED MARKS
    // ==========================================

    let finalObtainedMarks =
      existingMarks.obtainedMarks;

    if (obtainedMarks !== undefined) {
      const obtainedMarksNumber =
        Number(obtainedMarks);

      if (Number.isNaN(obtainedMarksNumber)) {
        return res.status(400).json({
          success: false,
          message:
            "obtainedMarks must be a valid number",
        });
      }

      if (obtainedMarksNumber < 0) {
        return res.status(400).json({
          success: false,
          message:
            "Obtained marks cannot be negative",
        });
      }

      finalObtainedMarks = obtainedMarksNumber;
    }

    // ==========================================
    // CHECK TOTAL MARKS
    // ==========================================

    const finalExamSubject =
      await prisma.examSubject.findUnique({
        where: {
          id: finalExamSubjectId,
        },
      });

    if (
      finalObtainedMarks >
      Number(finalExamSubject.totalMarks)
    ) {
      return res.status(400).json({
        success: false,
        message: `Obtained marks cannot be greater than ${finalExamSubject.totalMarks}`,
      });
    }

    // ==========================================
    // CHECK DUPLICATE
    // ==========================================

    const duplicateMarks =
      await prisma.mark.findFirst({
        where: {
          studentId: finalStudentId,
          examSubjectId: finalExamSubjectId,
          NOT: {
            id,
          },
        },
      });

    if (duplicateMarks) {
      return res.status(409).json({
        success: false,
        message:
          "Marks already exist for this student and exam subject",
      });
    }

    // ==========================================
    // UPDATE
    // ==========================================

    const updatedMarks =
      await prisma.mark.update({
        where: {
          id,
        },

        data: {
          studentId: finalStudentId,
          examSubjectId: finalExamSubjectId,
          obtainedMarks: finalObtainedMarks,
        },

        include: {
          student: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },

          examSubject: {
            include: {
              exam: true,
              subject: true,
            },
          },
        },
      });

    return res.status(200).json({
      success: true,
      message: "Marks updated successfully",
      data: updatedMarks,
    });
  } catch (error) {
    console.error("Update Marks Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update marks",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE MARKS
// DELETE /api/marks/:id
// ==========================================
const deleteMarks = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid marks ID",
      });
    }

    const existingMarks = await prisma.mark.findUnique({
      where: {
        id,
      },
    });

    if (!existingMarks) {
      return res.status(404).json({
        success: false,
        message: "Marks not found",
      });
    }

    await prisma.mark.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Marks deleted successfully",
    });
  } catch (error) {
    console.error("Delete Marks Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete marks",
      error: error.message,
    });
  }
};

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  createMarks,
  getMarks,
  getMarksById,
  updateMarks,
  deleteMarks,
};