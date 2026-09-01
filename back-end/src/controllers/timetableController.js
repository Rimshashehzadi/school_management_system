const prisma = require("../config/prisma");

// ==========================================
// CREATE TIMETABLE
// ==========================================

const createTimetable = async (req, res) => {
  try {
    const {
      classId,
      subjectId,
      teacherId,
      day,
      startTime,
      endTime,
      room,
    } = req.body;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (
      classId === undefined ||
      subjectId === undefined ||
      teacherId === undefined ||
      !day ||
      !startTime ||
      !endTime
    ) {
      return res.status(400).json({
        success: false,
        message:
          "classId, subjectId, teacherId, day, startTime and endTime are required",
      });
    }

    const classIdNumber = Number(classId);
    const subjectIdNumber = Number(subjectId);
    const teacherIdNumber = Number(teacherId);

    if (
      !Number.isInteger(classIdNumber) ||
      !Number.isInteger(subjectIdNumber) ||
      !Number.isInteger(teacherIdNumber)
    ) {
      return res.status(400).json({
        success: false,
        message: "classId, subjectId and teacherId must be valid integers",
      });
    }

    // ==========================================
    // CHECK CLASS
    // ==========================================

    const existingClass = await prisma.class.findUnique({
      where: {
        id: classIdNumber,
      },
    });

    if (!existingClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    // ==========================================
    // CHECK SUBJECT
    // ==========================================

    const subject = await prisma.subject.findUnique({
      where: {
        id: subjectIdNumber,
      },
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    // ==========================================
    // CHECK TEACHER
    // ==========================================

    const teacher = await prisma.teacher.findUnique({
      where: {
        id: teacherIdNumber,
      },
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    // ==========================================
    // VALIDATE TIME
    // ==========================================

    if (startTime >= endTime) {
      return res.status(400).json({
        success: false,
        message: "startTime must be before endTime",
      });
    }

    // ==========================================
    // CHECK CLASS TIME CONFLICT
    // ==========================================

    const classConflict = await prisma.timetable.findFirst({
      where: {
        classId: classIdNumber,
        day: day,

        AND: [
          {
            startTime: {
              lt: endTime,
            },
          },
          {
            endTime: {
              gt: startTime,
            },
          },
        ],
      },
    });

    if (classConflict) {
      return res.status(409).json({
        success: false,
        message: "Class already has a timetable entry at this time",
      });
    }

    // ==========================================
    // CHECK TEACHER TIME CONFLICT
    // ==========================================

    const teacherConflict = await prisma.timetable.findFirst({
      where: {
        teacherId: teacherIdNumber,
        day: day,

        AND: [
          {
            startTime: {
              lt: endTime,
            },
          },
          {
            endTime: {
              gt: startTime,
            },
          },
        ],
      },
    });

    if (teacherConflict) {
      return res.status(409).json({
        success: false,
        message: "Teacher already has a timetable entry at this time",
      });
    }

    // ==========================================
    // CREATE TIMETABLE
    // ==========================================

    const timetable = await prisma.timetable.create({
      data: {
        classId: classIdNumber,
        subjectId: subjectIdNumber,
        teacherId: teacherIdNumber,
        day: day.trim(),
        startTime: startTime.trim(),
        endTime: endTime.trim(),
        room: room ? room.trim() : null,
      },

      include: {
        class: true,
        subject: true,
        teacher: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Timetable created successfully",
      data: timetable,
    });
  } catch (error) {
    console.error("Create Timetable Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create timetable",
      error: error.message,
    });
  }
};

// ==========================================
// GET ALL TIMETABLES
// ==========================================

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

      include: {
        class: true,
        subject: true,
        teacher: true,
      },
    });

    return res.status(200).json({
      success: true,
      count: timetables.length,
      data: timetables,
    });
  } catch (error) {
    console.error("Get Timetables Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get timetables",
      error: error.message,
    });
  }
};

// ==========================================
// GET TIMETABLE BY ID
// ==========================================

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

      include: {
        class: true,
        subject: true,
        teacher: true,
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
    console.error("Get Timetable By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get timetable",
      error: error.message,
    });
  }
};

// ==========================================
// GET TIMETABLE BY CLASS
// ==========================================

const getTimetableByClass = async (req, res) => {
  try {
    const classId = Number(req.params.classId);

    if (!Number.isInteger(classId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid classId",
      });
    }

    const existingClass = await prisma.class.findUnique({
      where: {
        id: classId,
      },
    });

    if (!existingClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    const timetables = await prisma.timetable.findMany({
      where: {
        classId,
      },

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

    return res.status(200).json({
      success: true,
      class: existingClass,
      count: timetables.length,
      data: timetables,
    });
  } catch (error) {
    console.error("Get Class Timetable Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get class timetable",
      error: error.message,
    });
  }
};

// ==========================================
// GET TIMETABLE BY TEACHER
// ==========================================

const getTimetableByTeacher = async (req, res) => {
  try {
    const teacherId = Number(req.params.teacherId);

    if (!Number.isInteger(teacherId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid teacherId",
      });
    }

    const teacher = await prisma.teacher.findUnique({
      where: {
        id: teacherId,
      },
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    const timetables = await prisma.timetable.findMany({
      where: {
        teacherId,
      },

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

    return res.status(200).json({
      success: true,
      teacher,
      count: timetables.length,
      data: timetables,
    });
  } catch (error) {
    console.error("Get Teacher Timetable Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get teacher timetable",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE TIMETABLE
// ==========================================

const updateTimetable = async (req, res) => {
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

    const {
      classId,
      subjectId,
      teacherId,
      day,
      startTime,
      endTime,
      room,
    } = req.body;

    const finalClassId =
      classId !== undefined ? Number(classId) : existingTimetable.classId;

    const finalSubjectId =
      subjectId !== undefined
        ? Number(subjectId)
        : existingTimetable.subjectId;

    const finalTeacherId =
      teacherId !== undefined
        ? Number(teacherId)
        : existingTimetable.teacherId;

    const finalDay =
      day !== undefined ? day.trim() : existingTimetable.day;

    const finalStartTime =
      startTime !== undefined
        ? startTime.trim()
        : existingTimetable.startTime;

    const finalEndTime =
      endTime !== undefined
        ? endTime.trim()
        : existingTimetable.endTime;

    const finalRoom =
      room !== undefined
        ? room
          ? room.trim()
          : null
        : existingTimetable.room;

    // ==========================================
    // VALIDATE IDs
    // ==========================================

    if (
      !Number.isInteger(finalClassId) ||
      !Number.isInteger(finalSubjectId) ||
      !Number.isInteger(finalTeacherId)
    ) {
      return res.status(400).json({
        success: false,
        message: "classId, subjectId and teacherId must be valid integers",
      });
    }

    // ==========================================
    // CHECK CLASS
    // ==========================================

    const existingClass = await prisma.class.findUnique({
      where: {
        id: finalClassId,
      },
    });

    if (!existingClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    // ==========================================
    // CHECK SUBJECT
    // ==========================================

    const subject = await prisma.subject.findUnique({
      where: {
        id: finalSubjectId,
      },
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    // ==========================================
    // CHECK TEACHER
    // ==========================================

    const teacher = await prisma.teacher.findUnique({
      where: {
        id: finalTeacherId,
      },
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    // ==========================================
    // VALIDATE TIME
    // ==========================================

    if (finalStartTime >= finalEndTime) {
      return res.status(400).json({
        success: false,
        message: "startTime must be before endTime",
      });
    }

    // ==========================================
    // CHECK CLASS CONFLICT
    // ==========================================

    const classConflict = await prisma.timetable.findFirst({
      where: {
        classId: finalClassId,
        day: finalDay,

        AND: [
          {
            startTime: {
              lt: finalEndTime,
            },
          },
          {
            endTime: {
              gt: finalStartTime,
            },
          },
        ],

        NOT: {
          id,
        },
      },
    });

    if (classConflict) {
      return res.status(409).json({
        success: false,
        message: "Class already has a timetable entry at this time",
      });
    }

    // ==========================================
    // CHECK TEACHER CONFLICT
    // ==========================================

    const teacherConflict = await prisma.timetable.findFirst({
      where: {
        teacherId: finalTeacherId,
        day: finalDay,

        AND: [
          {
            startTime: {
              lt: finalEndTime,
            },
          },
          {
            endTime: {
              gt: finalStartTime,
            },
          },
        ],

        NOT: {
          id,
        },
      },
    });

    if (teacherConflict) {
      return res.status(409).json({
        success: false,
        message: "Teacher already has a timetable entry at this time",
      });
    }

    // ==========================================
    // UPDATE
    // ==========================================

    const updatedTimetable = await prisma.timetable.update({
      where: {
        id,
      },

      data: {
        classId: finalClassId,
        subjectId: finalSubjectId,
        teacherId: finalTeacherId,
        day: finalDay,
        startTime: finalStartTime,
        endTime: finalEndTime,
        room: finalRoom,
      },

      include: {
        class: true,
        subject: true,
        teacher: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Timetable updated successfully",
      data: updatedTimetable,
    });
  } catch (error) {
    console.error("Update Timetable Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update timetable",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE TIMETABLE
// ==========================================

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
    console.error("Delete Timetable Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete timetable",
      error: error.message,
    });
  }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  createTimetable,
  getTimetables,
  getTimetableById,
  getTimetableByClass,
  getTimetableByTeacher,
  updateTimetable,
  deleteTimetable,
};