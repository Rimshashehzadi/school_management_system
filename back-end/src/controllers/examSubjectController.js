const prisma = require("../config/prisma");

// ===============================
// ADD SUBJECT TO EXAM
// ===============================
const createExamSubject = async (req, res) => {
  try {
    const { examId, subjectId, totalMarks, passingMarks } = req.body;

    // Validation
    if (
      !examId ||
      !subjectId ||
      totalMarks === undefined ||
      passingMarks === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "examId, subjectId, totalMarks and passingMarks are required",
      });
    }

    // Check marks
    if (passingMarks > totalMarks) {
      return res.status(400).json({
        success: false,
        message: "Passing marks cannot be greater than total marks",
      });
    }

    // Check Exam
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

    // Check Subject
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

    // Create Exam Subject
    const examSubject = await prisma.examSubject.create({
      data: {
        examId: Number(examId),
        subjectId: Number(subjectId),
        totalMarks: Number(totalMarks),
        passingMarks: Number(passingMarks),
      },
      include: {
        exam: true,
        subject: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Subject added to exam successfully",
      data: examSubject,
    });
  } catch (error) {
    console.error("CREATE EXAM SUBJECT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add subject to exam",
      error: error.message,
    });
  }
};

// ===============================
// GET ALL EXAM SUBJECTS
// ===============================
const getExamSubjects = async (req, res) => {
  try {
    const examSubjects = await prisma.examSubject.findMany({
      include: {
        exam: true,
        subject: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: examSubjects.length,
      data: examSubjects,
    });
  } catch (error) {
    console.error("GET EXAM SUBJECTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch exam subjects",
      error: error.message,
    });
  }
};

// ===============================
// GET EXAM SUBJECT BY ID
// ===============================
const getExamSubjectById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ExamSubject ID",
      });
    }

    const examSubject = await prisma.examSubject.findUnique({
      where: {
        id,
      },
      include: {
        exam: true,
        subject: true,
      },
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
    console.error("GET EXAM SUBJECT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch exam subject",
      error: error.message,
    });
  }
};

// ===============================
// UPDATE EXAM SUBJECT
// ===============================
const updateExamSubject = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { totalMarks, passingMarks } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ExamSubject ID",
      });
    }

    const existingExamSubject =
      await prisma.examSubject.findUnique({
        where: { id },
      });

    if (!existingExamSubject) {
      return res.status(404).json({
        success: false,
        message: "Exam subject not found",
      });
    }

    const finalTotalMarks =
      totalMarks !== undefined
        ? Number(totalMarks)
        : existingExamSubject.totalMarks;

    const finalPassingMarks =
      passingMarks !== undefined
        ? Number(passingMarks)
        : existingExamSubject.passingMarks;

    if (finalPassingMarks > finalTotalMarks) {
      return res.status(400).json({
        success: false,
        message: "Passing marks cannot be greater than total marks",
      });
    }

    const examSubject = await prisma.examSubject.update({
      where: {
        id,
      },
      data: {
        ...(totalMarks !== undefined && {
          totalMarks: Number(totalMarks),
        }),
        ...(passingMarks !== undefined && {
          passingMarks: Number(passingMarks),
        }),
      },
      include: {
        exam: true,
        subject: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Exam subject updated successfully",
      data: examSubject,
    });
  } catch (error) {
    console.error("UPDATE EXAM SUBJECT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update exam subject",
      error: error.message,
    });
  }
};

// ===============================
// DELETE EXAM SUBJECT
// ===============================
const deleteExamSubject = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ExamSubject ID",
      });
    }

    const existingExamSubject =
      await prisma.examSubject.findUnique({
        where: { id },
      });

    if (!existingExamSubject) {
      return res.status(404).json({
        success: false,
        message: "Exam subject not found",
      });
    }

    await prisma.examSubject.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Exam subject deleted successfully",
    });
  } catch (error) {
    console.error("DELETE EXAM SUBJECT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete exam subject",
      error: error.message,
    });
  }
};

module.exports = {
  createExamSubject,
  getExamSubjects,
  getExamSubjectById,
  updateExamSubject,
  deleteExamSubject,
};