const prisma = require("../config/prisma");

// ==========================================
// CREATE TEACHER
// ==========================================

const createTeacher = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Teacher name is required",
      });
    }

    const teacher = await prisma.teacher.create({
      data: {
        name,
        email: email || null,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Teacher created successfully",
      data: teacher,
    });
  } catch (error) {
    console.error("Create Teacher Error:", error);

    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Teacher with this email already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create teacher",
      error: error.message,
    });
  }
};

// ==========================================
// GET ALL TEACHERS
// ==========================================

const getTeachers = async (req, res) => {
  try {
    const teachers = await prisma.teacher.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      count: teachers.length,
      data: teachers,
    });
  } catch (error) {
    console.error("Get Teachers Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get teachers",
      error: error.message,
    });
  }
};

// ==========================================
// GET TEACHER BY ID
// ==========================================

const getTeacherById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid teacher ID",
      });
    }

    const teacher = await prisma.teacher.findUnique({
      where: {
        id,
      },
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: teacher,
    });
  } catch (error) {
    console.error("Get Teacher Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get teacher",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE TEACHER
// ==========================================

const updateTeacher = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid teacher ID",
      });
    }

    const existingTeacher = await prisma.teacher.findUnique({
      where: {
        id,
      },
    });

    if (!existingTeacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    const { name, email } = req.body;

    const teacher = await prisma.teacher.update({
      where: {
        id,
      },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Teacher updated successfully",
      data: teacher,
    });
  } catch (error) {
    console.error("Update Teacher Error:", error);

    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Teacher with this email already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update teacher",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE TEACHER
// ==========================================

const deleteTeacher = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid teacher ID",
      });
    }

    const teacher = await prisma.teacher.findUnique({
      where: {
        id,
      },
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    await prisma.teacher.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Teacher deleted successfully",
    });
  } catch (error) {
    console.error("Delete Teacher Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete teacher",
      error: error.message,
    });
  }
};

module.exports = {
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
};