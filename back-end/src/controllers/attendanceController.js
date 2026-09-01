const prisma = require("../config/prisma");

// ========================================
// CREATE ATTENDANCE
// ========================================
const createAttendance = async (req, res) => {
  try {
    const { studentId, date, status } = req.body;

    // Validation
    if (!studentId || !date || !status) {
      return res.status(400).json({
        success: false,
        message: "studentId, date and status are required",
      });
    }

    // Validate status
    const validStatuses = ["PRESENT", "ABSENT", "LATE"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid attendance status",
        allowedStatuses: validStatuses,
      });
    }

    // Check student
    const student = await prisma.student.findUnique({
      where: {
        id: parseInt(studentId),
      },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Create attendance
    const attendance = await prisma.attendance.create({
      data: {
        studentId: parseInt(studentId),
        date: new Date(date),
        status,
      },
      include: {
        student: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Attendance created successfully",
      data: attendance,
    });
  } catch (error) {
    console.error("CREATE ATTENDANCE ERROR:", error);

    // Duplicate attendance
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Attendance already exists for this student on this date",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create attendance",
      error: error.message,
    });
  }
};

// ========================================
// GET ALL ATTENDANCE
// ========================================
const getAttendances = async (req, res) => {
  try {
    const attendance = await prisma.attendance.findMany({
      include: {
        student: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance,
    });
  } catch (error) {
    console.error("GET ATTENDANCE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch attendance",
      error: error.message,
    });
  }
};

// ========================================
// GET ATTENDANCE BY ID
// ========================================
const getAttendanceById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid attendance ID",
      });
    }

    const attendance = await prisma.attendance.findUnique({
      where: {
        id,
      },
      include: {
        student: true,
      },
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    console.error("GET ATTENDANCE BY ID ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch attendance",
      error: error.message,
    });
  }
};

// ========================================
// GET ATTENDANCE BY STUDENT
// ========================================
const getAttendanceByStudent = async (req, res) => {
  try {
    const studentId = parseInt(req.params.studentId);

    if (isNaN(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

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

    const attendance = await prisma.attendance.findMany({
      where: {
        studentId,
      },
      orderBy: {
        date: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      student,
      count: attendance.length,
      data: attendance,
    });
  } catch (error) {
    console.error("GET STUDENT ATTENDANCE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch student attendance",
      error: error.message,
    });
  }
};

// ========================================
// UPDATE ATTENDANCE
// ========================================
const updateAttendance = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { date, status } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid attendance ID",
      });
    }

    if (status) {
      const validStatuses = ["PRESENT", "ABSENT", "LATE"];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid attendance status",
          allowedStatuses: validStatuses,
        });
      }
    }

    const existingAttendance = await prisma.attendance.findUnique({
      where: {
        id,
      },
    });

    if (!existingAttendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found",
      });
    }

    const attendance = await prisma.attendance.update({
      where: {
        id,
      },
      data: {
        ...(date && { date: new Date(date) }),
        ...(status && { status }),
      },
      include: {
        student: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Attendance updated successfully",
      data: attendance,
    });
  } catch (error) {
    console.error("UPDATE ATTENDANCE ERROR:", error);

    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Attendance already exists for this student on this date",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update attendance",
      error: error.message,
    });
  }
};

// ========================================
// DELETE ATTENDANCE
// ========================================
const deleteAttendance = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid attendance ID",
      });
    }

    const existingAttendance = await prisma.attendance.findUnique({
      where: {
        id,
      },
    });

    if (!existingAttendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found",
      });
    }

    await prisma.attendance.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Attendance deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ATTENDANCE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete attendance",
      error: error.message,
    });
  }
};

module.exports = {
  createAttendance,
  getAttendances,
  getAttendanceById,
  getAttendanceByStudent,
  updateAttendance,
  deleteAttendance,
};