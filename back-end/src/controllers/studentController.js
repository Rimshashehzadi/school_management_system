const prisma = require("../config/prisma");

// ==========================================
// CREATE STUDENT
// POST /api/students
// ==========================================
const createStudent = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Student name is required",
      });
    }

    // Check duplicate email
    if (email) {
      const existingStudent = await prisma.student.findUnique({
        where: {
          email,
        },
      });

      if (existingStudent) {
        return res.status(409).json({
          success: false,
          message: "Student email already exists",
        });
      }
    }

    // Create student
    const student = await prisma.student.create({
      data: {
        name,
        email: email || null,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student,
    });
  } catch (error) {
    console.error("CREATE STUDENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create student",
      error: error.message,
    });
  }
};

// ==========================================
// GET ALL STUDENTS
// GET /api/students
// ==========================================
const getStudents = async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    console.error("GET STUDENTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch students",
      error: error.message,
    });
  }
};

// ==========================================
// GET STUDENT BY ID
// GET /api/students/:id
// ==========================================
const getStudentById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const student = await prisma.student.findUnique({
      where: {
        id,
      },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error("GET STUDENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch student",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE STUDENT
// PUT /api/students/:id
// ==========================================
const updateStudent = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const existingStudent = await prisma.student.findUnique({
      where: {
        id,
      },
    });

    if (!existingStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const { name, email } = req.body;

    if (!name && email === undefined) {
      return res.status(400).json({
        success: false,
        message: "Provide name or email to update",
      });
    }

    if (email) {
      const duplicateEmail = await prisma.student.findFirst({
        where: {
          email,
          NOT: {
            id,
          },
        },
      });

      if (duplicateEmail) {
        return res.status(409).json({
          success: false,
          message: "Student email already exists",
        });
      }
    }

    const updatedStudent = await prisma.student.update({
      where: {
        id,
      },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email: email || null }),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: updatedStudent,
    });
  } catch (error) {
    console.error("UPDATE STUDENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update student",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE STUDENT
// DELETE /api/students/:id
// ==========================================
const deleteStudent = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const existingStudent = await prisma.student.findUnique({
      where: {
        id,
      },
    });

    if (!existingStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    await prisma.student.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error("DELETE STUDENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete student",
      error: error.message,
    });
  }
};

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};