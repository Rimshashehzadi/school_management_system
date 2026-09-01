const express = require("express");
const cors = require("cors");

// ===============================
// ROUTES
// ===============================

const examRoutes = require("./routes/examRoutes");
const examSubjectRoutes = require("./routes/examSubjectRoutes");
const marksRoutes = require("./routes/marksRoutes");
const resultRoutes = require("./routes/resultRoutes");

// DAY 4 ROUTES
const teacherRoutes = require("./routes/teacherRoutes");
const classRoutes = require("./routes/classRoutes");
const timetableRoutes = require("./routes/timetableRoutes");
//  Day 5
const parentRoutes = require("./routes/parentRoutes");
const parentStudentRoutes = require("./routes/parentStudentRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const userRoutes = require("./routes/userRoutes");
//  Day 6

const dashboardRoutes = require("./routes/dashboardRoutes");
const studentReportRoutes = require("./routes/studentReportRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const attendanceReportRoutes = require("./routes/attendanceReportRoutes");
const feeRoutes = require("./routes/feeRoutes");
const feeReportRoutes = require("./routes/feeReportRoutes");
const examReportRoutes = require("./routes/examReportRoutes");
const studentExportRoutes = require("./routes/studentExportRoutes");

// ===============================
// PRISMA
// ===============================

const prisma = require("./config/prisma");

// ===============================
// APP
// ===============================

const app = express();

// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================================================
// HEALTH CHECK
// ==================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "School Management System API is running",
  });
});

// ==================================================
// TEST ROUTE
// ==================================================

app.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TEST ROUTE IS WORKING",
  });
});

// ==================================================
// PRISMA + MYSQL TEST
// ==================================================

app.get("/test-prisma", async (req, res) => {
  try {
    const exams = await prisma.exam.findMany({
      orderBy: {
        id: "asc",
      },
    });

    res.status(200).json({
      success: true,
      message: "Prisma connected to MySQL successfully",
      count: exams.length,
      exams,
    });
  } catch (error) {
    console.error("PRISMA ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Prisma/MySQL connection failed",
      error: error.message,
    });
  }
});

// ==================================================
// DEBUG - GET ALL EXAMS
// ==================================================

app.get("/debug-exams", async (req, res) => {
  try {
    const exams = await prisma.exam.findMany({
      orderBy: {
        id: "asc",
      },
    });

    res.status(200).json({
      success: true,
      count: exams.length,
      data: exams,
    });
  } catch (error) {
    console.error("DEBUG EXAMS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get exams",
      error: error.message,
    });
  }
});

// ==================================================
// DEBUG - GET ALL STUDENTS
// ==================================================

app.get("/debug-students", async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      orderBy: {
        id: "asc",
      },
    });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    console.error("DEBUG STUDENTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get students",
      error: error.message,
    });
  }
});

// ==================================================
// DEBUG - CREATE STUDENT
// ==================================================

app.post("/debug-students", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Student name is required",
      });
    }

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

    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "A student with this email already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create student",
      error: error.message,
    });
  }
});

// ==================================================
// DEBUG - GET ALL SUBJECTS
// ==================================================

app.get("/debug-subjects", async (req, res) => {
  try {
    const subjects = await prisma.subject.findMany({
      orderBy: {
        id: "asc",
      },
    });

    res.status(200).json({
      success: true,
      count: subjects.length,
      data: subjects,
    });
  } catch (error) {
    console.error("DEBUG SUBJECTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get subjects",
      error: error.message,
    });
  }
});

// ==================================================
// DEBUG - GET ALL EXAM SUBJECTS
// ==================================================

app.get("/debug-exam-subjects", async (req, res) => {
  try {
    const examSubjects = await prisma.examSubject.findMany({
      orderBy: {
        id: "asc",
      },
      include: {
        exam: true,
        subject: true,
      },
    });

    res.status(200).json({
      success: true,
      count: examSubjects.length,
      data: examSubjects,
    });
  } catch (error) {
    console.error("DEBUG EXAM SUBJECTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get exam subjects",
      error: error.message,
    });
  }
});

// ==================================================
// DEBUG - GET ALL MARKS
// ==================================================

app.get("/debug-marks", async (req, res) => {
  try {
    const marks = await prisma.mark.findMany({
      orderBy: {
        id: "desc",
      },
      include: {
        student: true,
        examSubject: {
          include: {
            exam: true,
            subject: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      count: marks.length,
      data: marks,
    });
  } catch (error) {
    console.error("DEBUG MARKS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get marks",
      error: error.message,
    });
  }
});

// ==================================================
// DEBUG - GET ALL TEACHERS
// ==================================================

app.get("/debug-teachers", async (req, res) => {
  try {
    const teachers = await prisma.teacher.findMany({
      orderBy: {
        id: "asc",
      },
    });

    res.status(200).json({
      success: true,
      count: teachers.length,
      data: teachers,
    });
  } catch (error) {
    console.error("DEBUG TEACHERS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get teachers",
      error: error.message,
    });
  }
});

// ==================================================
// DEBUG - GET ALL CLASSES
// ==================================================

app.get("/debug-classes", async (req, res) => {
  try {
    const classes = await prisma.class.findMany({
      orderBy: {
        id: "asc",
      },
    });

    res.status(200).json({
      success: true,
      count: classes.length,
      data: classes,
    });
  } catch (error) {
    console.error("DEBUG CLASSES ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get classes",
      error: error.message,
    });
  }
});

// ==================================================
// DEBUG - GET ALL TIMETABLES
// ==================================================

app.get("/debug-timetables", async (req, res) => {
  try {
    const timetables = await prisma.timetable.findMany({
      orderBy: [
        {
          day: "asc",
        },
        {
          startTime: "asc",
        },
      ],
      include: {
        class: true,
        subject: true,
        teacher: true,
      },
    });

    res.status(200).json({
      success: true,
      count: timetables.length,
      data: timetables,
    });
  } catch (error) {
    console.error("DEBUG TIMETABLE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get timetables",
      error: error.message,
    });
  }
});

// ==================================================
// EXAM API
// ==================================================

app.use("/api/exams", examRoutes);

// ==================================================
// EXAM SUBJECT API
// ==================================================

app.use("/api/exam-subjects", examSubjectRoutes);

// ==================================================
// MARKS API
// ==================================================

app.use("/api/marks", marksRoutes);

// ==================================================
// RESULT API
// ==================================================

app.use("/api/results", resultRoutes);

// ==================================================
// DAY 4 - TEACHER API
// ==================================================

app.use("/api/teachers", teacherRoutes);

// ==================================================
// DAY 4 - CLASS API
// ==================================================

app.use("/api/classes", classRoutes);

// ==================================================
// DAY 4 - TIMETABLE API
// ==================================================

app.use("/api/timetables", timetableRoutes);

// DAY 5 - PARENT API
app.use("/api/parents", parentRoutes);
// DAY 5 - PARENT STUDENT RELATIONSHIP
app.use("/api/parent-students", parentStudentRoutes);
// ==================================================
// DAY 5 - NOTICE API
// ==================================================

app.use("/api/notices", noticeRoutes);
// ==================================================
// DAY 5 - USER API
// ==================================================

app.use("/api/users", userRoutes);

// ==================================================
// DAY 6 - DASHBOARD API
// ==================================================

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/student-reports", studentReportRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/attendance-reports", attendanceReportRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/fee-reports", feeReportRoutes);
app.use("/api/exam-reports", examReportRoutes);
app.use("/api/export", studentExportRoutes);

// ==================================================
// DEBUG - API ROUTES CHECK
// ==================================================

app.get("/debug-api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API routes are working",

    routes: {
      exams: "/api/exams",
      examSubjects: "/api/exam-subjects",
      marks: "/api/marks",
      results: "/api/results",

      teachers: "/api/teachers",
      classes: "/api/classes",
      timetables: "/api/timetables",

      debugTeachers: "/debug-teachers",
      debugClasses: "/debug-classes",
      debugTimetables: "/debug-timetables",
    },
  });
});

// ==================================================
// 404 HANDLER
// ==================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// ==================================================
// ERROR HANDLER
// ==================================================

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message,
  });
});

// ==================================================
// EXPORT APP
// ==================================================

module.exports = app;