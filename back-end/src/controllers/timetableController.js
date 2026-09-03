const prisma = require("../config/prisma");

// =====================================================
// HELPER FUNCTIONS
// =====================================================

// Normalize text for comparison
const normalizeText = (value) => {
  return String(value || "").trim().toLowerCase();
};

// Check whether two time ranges overlap
const isTimeOverlap = (start1, end1, start2, end2) => {
  return start1 < end2 && end1 > start2;
};

// =====================================================
// CREATE TIMETABLE
// POST /api/timetables
// =====================================================
const createTimetable = async (req, res) => {
  try {
    const {
      className,
      subjectName,
      teacherName,
      day,
      startTime,
      endTime,
      room,
    } = req.body;

    // -----------------------------
    // Validation
    // -----------------------------
    if (
      !className ||
      !subjectName ||
      !teacherName ||
      !day ||
      !startTime ||
      !endTime
    ) {
      return res.status(400).json({
        success: false,
        message:
          "className, subjectName, teacherName, day, startTime and endTime are required",
      });
    }

    // Clean input
    const cleanClassName = String(className).trim();
    const cleanSubjectName = String(subjectName).trim();
    const cleanTeacherName = String(teacherName).trim();
    const cleanDay = String(day).trim();
    const cleanStartTime = String(startTime).trim();
    const cleanEndTime = String(endTime).trim();
    const cleanRoom = room ? String(room).trim() : null;

    // -----------------------------
    // Validate time
    // -----------------------------
    if (cleanStartTime >= cleanEndTime) {
      return res.status(400).json({
        success: false,
        message: "Start time must be earlier than end time",
      });
    }

    // -----------------------------
    // Get existing timetable
    // for same day
    // -----------------------------
    const existingTimetables = await prisma.timetable.findMany({
      where: {
        day: cleanDay,
      },
    });

    const normalizedClass = normalizeText(cleanClassName);
    const normalizedTeacher = normalizeText(cleanTeacherName);

    // -----------------------------
    // Class conflict
    // -----------------------------
    const classConflict = existingTimetables.find((item) => {
      return (
        normalizeText(item.className) === normalizedClass &&
        isTimeOverlap(
          cleanStartTime,
          cleanEndTime,
          item.startTime,
          item.endTime
        )
      );
    });

    if (classConflict) {
      return res.status(409).json({
        success: false,
        message: `Class "${cleanClassName}" already has a timetable from ${classConflict.startTime} to ${classConflict.endTime} on ${cleanDay}`,
      });
    }

    // -----------------------------
    // Teacher conflict
    // -----------------------------
    const teacherConflict = existingTimetables.find((item) => {
      return (
        normalizeText(item.teacherName) === normalizedTeacher &&
        isTimeOverlap(
          cleanStartTime,
          cleanEndTime,
          item.startTime,
          item.endTime
        )
      );
    });

    if (teacherConflict) {
      return res.status(409).json({
        success: false,
        message: `Teacher "${cleanTeacherName}" already has a timetable from ${teacherConflict.startTime} to ${teacherConflict.endTime} on ${cleanDay}`,
      });
    }

    // -----------------------------
    // Create timetable
    // -----------------------------
    const timetable = await prisma.timetable.create({
      data: {
        className: cleanClassName,
        subjectName: cleanSubjectName,
        teacherName: cleanTeacherName,
        day: cleanDay,
        startTime: cleanStartTime,
        endTime: cleanEndTime,
        room: cleanRoom,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Timetable created successfully",
      data: timetable,
    });
  } catch (error) {
    console.error("CREATE TIMETABLE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create timetable",
      error: error.message,
    });
  }
};

// =====================================================
// GET ALL TIMETABLES
// GET /api/timetables
// =====================================================
const getTimetables = async (req, res) => {
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
    });

    return res.status(200).json({
      success: true,
      count: timetables.length,
      data: timetables,
    });
  } catch (error) {
    console.error("GET TIMETABLES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch timetables",
      error: error.message,
    });
  }
};

// =====================================================
// GET TIMETABLE BY ID
// GET /api/timetables/:id
// =====================================================
const getTimetableById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid timetable ID",
      });
    }

    const timetable = await prisma.timetable.findUnique({
      where: {
        id,
      },
    });

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: "Timetable not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: timetable,
    });
  } catch (error) {
    console.error("GET TIMETABLE BY ID ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch timetable",
      error: error.message,
    });
  }
};

// =====================================================
// GET TIMETABLE BY CLASS NAME
// GET /api/timetables/class/:className
// =====================================================
const getTimetableByClass = async (req, res) => {
  try {
    const className = decodeURIComponent(req.params.className).trim();

    if (!className) {
      return res.status(400).json({
        success: false,
        message: "Class name is required",
      });
    }

    const timetables = await prisma.timetable.findMany({
      where: {
        className: className,
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      count: timetables.length,
      data: timetables,
    });
  } catch (error) {
    console.error("GET CLASS TIMETABLE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch class timetable",
      error: error.message,
    });
  }
};

// =====================================================
// GET TIMETABLE BY TEACHER NAME
// GET /api/timetables/teacher/:teacherName
// =====================================================
const getTimetableByTeacher = async (req, res) => {
  try {
    const teacherName = decodeURIComponent(
      req.params.teacherName
    ).trim();

    if (!teacherName) {
      return res.status(400).json({
        success: false,
        message: "Teacher name is required",
      });
    }

    const timetables = await prisma.timetable.findMany({
      where: {
        teacherName: teacherName,
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      count: timetables.length,
      data: timetables,
    });
  } catch (error) {
    console.error("GET TEACHER TIMETABLE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch teacher timetable",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE TIMETABLE
// PUT /api/timetables/:id
// =====================================================
const updateTimetable = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid timetable ID",
      });
    }

    // -----------------------------
    // Check timetable exists
    // -----------------------------
    const existingTimetable = await prisma.timetable.findUnique({
      where: {
        id,
      },
    });

    if (!existingTimetable) {
      return res.status(404).json({
        success: false,
        message: "Timetable not found",
      });
    }

    const {
      className,
      subjectName,
      teacherName,
      day,
      startTime,
      endTime,
      room,
    } = req.body;

    // -----------------------------
    // Use old values if not provided
    // -----------------------------
    const cleanClassName =
      className !== undefined
        ? String(className).trim()
        : existingTimetable.className;

    const cleanSubjectName =
      subjectName !== undefined
        ? String(subjectName).trim()
        : existingTimetable.subjectName;

    const cleanTeacherName =
      teacherName !== undefined
        ? String(teacherName).trim()
        : existingTimetable.teacherName;

    const cleanDay =
      day !== undefined
        ? String(day).trim()
        : existingTimetable.day;

    const cleanStartTime =
      startTime !== undefined
        ? String(startTime).trim()
        : existingTimetable.startTime;

    const cleanEndTime =
      endTime !== undefined
        ? String(endTime).trim()
        : existingTimetable.endTime;

    const cleanRoom =
      room !== undefined
        ? room
          ? String(room).trim()
          : null
        : existingTimetable.room;

    // -----------------------------
    // Required fields
    // -----------------------------
    if (
      !cleanClassName ||
      !cleanSubjectName ||
      !cleanTeacherName ||
      !cleanDay ||
      !cleanStartTime ||
      !cleanEndTime
    ) {
      return res.status(400).json({
        success: false,
        message:
          "className, subjectName, teacherName, day, startTime and endTime are required",
      });
    }

    // -----------------------------
    // Validate time
    // -----------------------------
    if (cleanStartTime >= cleanEndTime) {
      return res.status(400).json({
        success: false,
        message: "Start time must be earlier than end time",
      });
    }

    // -----------------------------
    // Get other timetables
    // -----------------------------
    const otherTimetables = await prisma.timetable.findMany({
      where: {
        day: cleanDay,
        NOT: {
          id,
        },
      },
    });

    const normalizedClass = normalizeText(cleanClassName);
    const normalizedTeacher = normalizeText(cleanTeacherName);

    // -----------------------------
    // Class conflict
    // -----------------------------
    const classConflict = otherTimetables.find((item) => {
      return (
        normalizeText(item.className) === normalizedClass &&
        isTimeOverlap(
          cleanStartTime,
          cleanEndTime,
          item.startTime,
          item.endTime
        )
      );
    });

    if (classConflict) {
      return res.status(409).json({
        success: false,
        message: `Class "${cleanClassName}" already has a timetable from ${classConflict.startTime} to ${classConflict.endTime} on ${cleanDay}`,
      });
    }

    // -----------------------------
    // Teacher conflict
    // -----------------------------
    const teacherConflict = otherTimetables.find((item) => {
      return (
        normalizeText(item.teacherName) === normalizedTeacher &&
        isTimeOverlap(
          cleanStartTime,
          cleanEndTime,
          item.startTime,
          item.endTime
        )
      );
    });

    if (teacherConflict) {
      return res.status(409).json({
        success: false,
        message: `Teacher "${cleanTeacherName}" already has a timetable from ${teacherConflict.startTime} to ${teacherConflict.endTime} on ${cleanDay}`,
      });
    }

    // -----------------------------
    // Update timetable
    // -----------------------------
    const updatedTimetable = await prisma.timetable.update({
      where: {
        id,
      },
      data: {
        className: cleanClassName,
        subjectName: cleanSubjectName,
        teacherName: cleanTeacherName,
        day: cleanDay,
        startTime: cleanStartTime,
        endTime: cleanEndTime,
        room: cleanRoom,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Timetable updated successfully",
      data: updatedTimetable,
    });
  } catch (error) {
    console.error("UPDATE TIMETABLE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update timetable",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE TIMETABLE
// DELETE /api/timetables/:id
// =====================================================
const deleteTimetable = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid timetable ID",
      });
    }

    const existingTimetable = await prisma.timetable.findUnique({
      where: {
        id,
      },
    });

    if (!existingTimetable) {
      return res.status(404).json({
        success: false,
        message: "Timetable not found",
      });
    }

    await prisma.timetable.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Timetable deleted successfully",
    });
  } catch (error) {
    console.error("DELETE TIMETABLE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete timetable",
      error: error.message,
    });
  }
};

// =====================================================
// EXPORTS
// =====================================================
module.exports = {
  createTimetable,
  getTimetables,
  getTimetableById,
  getTimetableByClass,
  getTimetableByTeacher,
  updateTimetable,
  deleteTimetable,
};