const prisma = require("../config/prisma");

const createExam = async (req, res) => {
  try {
    const { name, startDate, endDate } = req.body;

    if (!name || !startDate || !endDate) {
      return res.status(400).json({
        message: "name, startDate and endDate are required",
      });
    }

    const exam = await prisma.exam.create({
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });

    res.status(201).json({
      message: "Exam created successfully",
      exam,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create exam",
      error: error.message,
    });
  }
};

const getExams = async (req, res) => {
  try {
    const exams = await prisma.exam.findMany({
      include: {
        examSubjects: {
          include: {
            subject: true,
          },
        },
      },
      orderBy: {
        startDate: "desc",
      },
    });

    res.json(exams);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch exams",
      error: error.message,
    });
  }
};

const getExamById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const exam = await prisma.exam.findUnique({
      where: { id },
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
        message: "Exam not found",
      });
    }

    res.json(exam);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch exam",
      error: error.message,
    });
  }
};

const updateExam = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, startDate, endDate } = req.body;

    const exam = await prisma.exam.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
      },
    });

    res.json({
      message: "Exam updated successfully",
      exam,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update exam",
      error: error.message,
    });
  }
};

const deleteExam = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.exam.delete({
      where: { id },
    });

    res.json({
      message: "Exam deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
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