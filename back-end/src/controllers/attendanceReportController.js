const prisma = require("../config/prisma");

// ========================================
// GET STUDENT ATTENDANCE REPORT
// ========================================
const getAttendanceReport = async (req, res) => {
  try {
    const studentId = parseInt(req.params.studentId);

    // Validate student ID
    if (isNaN(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    // Check student
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

    // Get attendance records
    const attendance = await prisma.attendance.findMany({
      where: {
        studentId,
      },
      orderBy: {
        date: "asc",
      },
    });

    // Calculate statistics
    const totalDays = attendance.length;

    const presentDays = attendance.filter(
      (record) => record.status === "PRESENT"
    ).length;

    const absentDays = attendance.filter(
      (record) => record.status === "ABSENT"
    ).length;

    const lateDays = attendance.filter(
      (record) => record.status === "LATE"
    ).length;

    // Calculate percentage
    const attendancePercentage =
      totalDays > 0
        ? Number(((presentDays / totalDays) * 100).toFixed(2))
        : 0;

    return res.status(200).json({
      success: true,
      message: "Attendance report fetched successfully",

      data: {
        student,

        summary: {
          totalDays,
          presentDays,
          absentDays,
          lateDays,
          attendancePercentage,
        },

        attendance,
      },
    });
  } catch (error) {
    console.error("ATTENDANCE REPORT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch attendance report",
      error: error.message,
    });
  }
};

module.exports = {
  getAttendanceReport,
};