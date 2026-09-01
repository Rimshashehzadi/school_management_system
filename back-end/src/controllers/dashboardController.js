const prisma = require("../config/prisma");

// ==================================================
// GET DASHBOARD STATISTICS
// ==================================================

const getDashboardStats = async (req, res) => {
  try {
    // Run all counts together for better performance
    const [
      students,
      teachers,
      parents,
      classes,
      subjects,
      exams,
      notices,
      users,
      timetables,
    ] = await Promise.all([
      prisma.student.count(),
      prisma.teacher.count(),
      prisma.parent.count(),
      prisma.class.count(),
      prisma.subject.count(),
      prisma.exam.count(),
      prisma.notice.count(),
      prisma.user.count(),
      prisma.timetable.count(),
    ]);

    return res.status(200).json({
      success: true,
      message: "Dashboard statistics fetched successfully",
      data: {
        students,
        teachers,
        parents,
        classes,
        subjects,
        exams,
        notices,
        users,
        timetables,
      },
    });
  } catch (error) {
    console.error("DASHBOARD STATS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};