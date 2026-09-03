const prisma = require("../config/prisma");

// =========================================================
// COMMON INCLUDE
// =========================================================

const examSubjectInclude = {
  exam: true,
  subject: true,
  marks: {
    include: {
      student: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  },
};

// =========================================================
// CREATE EXAM SUBJECT
// =========================================================

const createExamSubject = async (req, res) => {
  try {
    const {
      examId,
      subjectId,
      totalMarks,
      passingMarks,
    } = req.body;

    // -------------------------------
    // VALIDATION
    // -------------------------------

    if (
      examId === undefined ||
      subjectId === undefined ||
      totalMarks === undefined ||
      passingMarks === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "examId, subjectId, totalMarks and passingMarks are required",
      });
    }

    if (Number(totalMarks) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Total marks must be greater than 0",
      });
    }

    if (
      Number(passingMarks) < 0 ||
      Number(passingMarks) > Number(totalMarks)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Passing marks must be between 0 and total marks",
      });
    }

    // -------------------------------
    // CHECK EXAM
    // -------------------------------

    const exam = await prisma.exam.findUnique({
      where: {
        id: Number(examId),
      },
    });

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    // -------------------------------
    // CHECK SUBJECT
    // -------------------------------

    const subject = await prisma.subject.findUnique({
      where: {
        id: Number(subjectId),
      },
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    // -------------------------------
    // CHECK DUPLICATE
    // -------------------------------

    const existingExamSubject =
      await prisma.examSubject.findUnique({
        where: {
          examId_subjectId: {
            examId: Number(examId),
            subjectId: Number(subjectId),
          },
        },
      });

    if (existingExamSubject) {
      return res.status(409).json({
        success: false,
        message:
          "This subject is already assigned to this exam",
      });
    }

    // -------------------------------
    // CREATE
    // -------------------------------

    const examSubject =
      await prisma.examSubject.create({
        data: {
          examId: Number(examId),
          subjectId: Number(subjectId),
          totalMarks: Number(totalMarks),
          passingMarks: Number(passingMarks),
        },
        include: examSubjectInclude,
      });

    return res.status(201).json({
      success: true,
      message: "Exam subject created successfully",
      data: examSubject,
    });
  } catch (error) {
    console.error(
      "Create Exam Subject Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create exam subject",
      error: error.message,
    });
  }
};

// =========================================================
// GET ALL EXAM SUBJECTS
// =========================================================

const getExamSubjects = async (req, res) => {
  try {
    const examSubjects =
      await prisma.examSubject.findMany({
        include: examSubjectInclude,
        orderBy: {
          id: "desc",
        },
      });

    return res.status(200).json({
      success: true,
      count: examSubjects.length,
      data: examSubjects,
    });
  } catch (error) {
    console.error(
      "Get Exam Subjects Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch exam subjects",
      error: error.message,
    });
  }
};

// =========================================================
// GET SINGLE EXAM SUBJECT
// =========================================================

const getExamSubjectById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid exam subject ID",
      });
    }

    const examSubject =
      await prisma.examSubject.findUnique({
        where: {
          id,
        },
        include: examSubjectInclude,
      });

    if (!examSubject) {
      return res.status(404).json({
        success: false,
        message: "Exam subject not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: examSubject,
    });
  } catch (error) {
    console.error(
      "Get Exam Subject By ID Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch exam subject",
      error: error.message,
    });
  }
};

// =========================================================
// UPDATE EXAM SUBJECT
//
// This updates:
// 1. Exam name in Exam table
// 2. Subject name in Subject table
// 3. Total marks
// 4. Passing marks
//
// examId and subjectId remain the same.
// =========================================================

const updateExamSubject = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const {
      examName,
      subjectName,
      totalMarks,
      passingMarks,
    } = req.body;

    // -------------------------------
    // VALIDATION
    // -------------------------------

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid exam subject ID",
      });
    }

    if (
      !examName ||
      !examName.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Exam name is required",
      });
    }

    if (
      !subjectName ||
      !subjectName.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Subject name is required",
      });
    }

    if (totalMarks === undefined) {
      return res.status(400).json({
        success: false,
        message: "Total marks are required",
      });
    }

    if (passingMarks === undefined) {
      return res.status(400).json({
        success: false,
        message: "Passing marks are required",
      });
    }

    const numericTotalMarks = Number(totalMarks);
    const numericPassingMarks = Number(passingMarks);

    if (
      Number.isNaN(numericTotalMarks) ||
      numericTotalMarks <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Total marks must be greater than 0",
      });
    }

    if (
      Number.isNaN(numericPassingMarks) ||
      numericPassingMarks < 0 ||
      numericPassingMarks > numericTotalMarks
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Passing marks must be between 0 and total marks",
      });
    }

    // -------------------------------
    // FIND EXAM SUBJECT
    // -------------------------------

    const existingExamSubject =
      await prisma.examSubject.findUnique({
        where: {
          id,
        },
        include: {
          exam: true,
          subject: true,
        },
      });

    if (!existingExamSubject) {
      return res.status(404).json({
        success: false,
        message: "Exam subject not found",
      });
    }

    // -------------------------------
    // PREPARE NAMES
    // -------------------------------

    const newExamName = examName.trim();
    const newSubjectName = subjectName.trim();

    // =====================================================
    // CHECK IF ANOTHER EXAM ALREADY HAS THIS NAME
    // =====================================================

    const duplicateExam =
      await prisma.exam.findFirst({
        where: {
          name: newExamName,
          NOT: {
            id: existingExamSubject.examId,
          },
        },
      });

    if (duplicateExam) {
      return res.status(409).json({
        success: false,
        message:
          "Another exam already exists with this name",
      });
    }

    // =====================================================
    // CHECK IF ANOTHER SUBJECT ALREADY HAS THIS NAME
    // =====================================================

    const duplicateSubject =
      await prisma.subject.findFirst({
        where: {
          name: newSubjectName,
          NOT: {
            id: existingExamSubject.subjectId,
          },
        },
      });

    if (duplicateSubject) {
      return res.status(409).json({
        success: false,
        message:
          "Another subject already exists with this name",
      });
    }

    // =====================================================
    // UPDATE EVERYTHING IN ONE TRANSACTION
    // =====================================================

    await prisma.$transaction([
      // -----------------------------------------------
      // UPDATE EXAM TABLE
      // -----------------------------------------------

      prisma.exam.update({
        where: {
          id: existingExamSubject.examId,
        },
        data: {
          name: newExamName,
        },
      }),

      // -----------------------------------------------
      // UPDATE SUBJECT TABLE
      // -----------------------------------------------

      prisma.subject.update({
        where: {
          id: existingExamSubject.subjectId,
        },
        data: {
          name: newSubjectName,
        },
      }),

      // -----------------------------------------------
      // UPDATE EXAM SUBJECT TABLE
      // -----------------------------------------------

      prisma.examSubject.update({
        where: {
          id,
        },
        data: {
          totalMarks: numericTotalMarks,
          passingMarks: numericPassingMarks,
        },
      }),
    ]);

    // =====================================================
    // IMPORTANT:
    // FETCH AGAIN AFTER UPDATE
    //
    // This guarantees that exam.name and subject.name
    // come from the latest database values.
    // =====================================================

    const updatedExamSubject =
      await prisma.examSubject.findUnique({
        where: {
          id,
        },
        include: examSubjectInclude,
      });

    return res.status(200).json({
      success: true,
      message:
        "Exam subject updated successfully",
      data: updatedExamSubject,
    });
  } catch (error) {
    console.error(
      "Update Exam Subject Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update exam subject",
      error: error.message,
    });
  }
};

// =========================================================
// DELETE EXAM SUBJECT
// =========================================================

const deleteExamSubject = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid exam subject ID",
      });
    }

    // -------------------------------
    // CHECK EXISTS
    // -------------------------------

    const examSubject =
      await prisma.examSubject.findUnique({
        where: {
          id,
        },
      });

    if (!examSubject) {
      return res.status(404).json({
        success: false,
        message: "Exam subject not found",
      });
    }

    // -------------------------------
    // DELETE
    // -------------------------------

    await prisma.examSubject.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message:
        "Exam subject deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Exam Subject Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete exam subject",
      error: error.message,
    });
  }
};

// =========================================================
// EXPORTS
// =========================================================

module.exports = {
  createExamSubject,
  getExamSubjects,
  getExamSubjectById,
  updateExamSubject,
  deleteExamSubject,
};