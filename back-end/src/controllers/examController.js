const prisma = require("../config/prisma");

// ===============================
// CREATE EXAM
// ===============================
const createExam = async (req, res) => {
  try {
    const { name, startDate, endDate } = req.body;

    // Validation
    if (!name || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Name, startDate and endDate are required",
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format",
      });
    }

    if (end < start) {
      return res.status(400).json({
        success: false,
        message: "End date cannot be before start date",
      });
    }

    // Create exam
    const exam = await prisma.exam.create({
      data: {
        name,
        startDate: start,
        endDate: end,
      },
    });

    res.status(201).json({
      success: true,
      message: "Exam created successfully",
      data: exam,
    });
  } catch (error) {
    console.error("Create Exam Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create exam",
      error: error.message,
    });
  }
};

// ===============================
// GET ALL EXAMS
// ===============================
const getExams = async (req, res) => {
  try {
    const exams = await prisma.exam.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        examSubjects: {
          include: {
            subject: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      count: exams.length,
      data: exams,
    });
  } catch (error) {
    console.error("Get Exams Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch exams",
      error: error.message,
    });
  }
};

// ===============================
// GET EXAM BY ID
// ===============================
const getExamById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid exam ID",
      });
    }

    const exam = await prisma.exam.findUnique({
      where: {
        id,
      },
      include: {
        examSubjects: {
          include: {
            subject: true,
          },
        },
      },
    });

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    res.status(200).json({
      success: true,
      data: exam,
    });
  } catch (error) {
    console.error("Get Exam Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch exam",
      error: error.message,
    });
  }
};

// ===============================
// UPDATE EXAM
// ===============================
const updateExam = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, startDate, endDate } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid exam ID",
      });
    }

    // Check exam exists
    const existingExam = await prisma.exam.findUnique({
      where: {
        id,
      },
    });

    if (!existingExam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    // Prepare update data
    const updateData = {};

    if (name !== undefined) {
      updateData.name = name;
    }

    if (startDate !== undefined) {
      const start = new Date(startDate);

      if (isNaN(start.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid startDate",
        });
      }

      updateData.startDate = start;
    }

    if (endDate !== undefined) {
      const end = new Date(endDate);

      if (isNaN(end.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid endDate",
        });
      }

      updateData.endDate = end;
    }

    // Check date range
    const finalStartDate =
      updateData.startDate || existingExam.startDate;

    const finalEndDate =
      updateData.endDate || existingExam.endDate;

    if (finalEndDate < finalStartDate) {
      return res.status(400).json({
        success: false,
        message: "End date cannot be before start date",
      });
    }

    const exam = await prisma.exam.update({
      where: {
        id,
      },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      message: "Exam updated successfully",
      data: exam,
    });
  } catch (error) {
    console.error("Update Exam Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update exam",
      error: error.message,
    });
  }
};

// ===============================
// DELETE EXAM
// ===============================
const deleteExam = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid exam ID",
      });
    }

    // Check exam exists
    const existingExam = await prisma.exam.findUnique({
      where: {
        id,
      },
    });

    if (!existingExam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    await prisma.exam.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Exam deleted successfully",
    });
  } catch (error) {
    console.error("Delete Exam Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete exam",
      error: error.message,
    });
  }
};

module.exports = {
  createExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam,
};