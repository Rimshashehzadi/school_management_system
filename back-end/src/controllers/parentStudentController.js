const prisma = require("../config/prisma");

// ==================================================
// ADD / UPDATE STUDENT-PARENT RELATIONSHIP
// ==================================================

const addStudentToParent = async (req, res) => {
  try {
    const { parentName, studentName, relation } = req.body;

    // ==================================================
    // VALIDATION
    // ==================================================

    if (!parentName || !parentName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Parent / Guardian name is required",
      });
    }

    if (!studentName || !studentName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Student name is required",
      });
    }

    if (!relation || !relation.trim()) {
      return res.status(400).json({
        success: false,
        message: "Relation is required",
      });
    }

    const cleanParentName = parentName.trim();
    const cleanStudentName = studentName.trim();
    const cleanRelation = relation.trim();

    // ==================================================
    // FIND STUDENT
    // ==================================================
    // Student must already exist in students table.
    // ==================================================

    const student = await prisma.student.findFirst({
      where: {
        name: {
          equals: cleanStudentName,
        },
      },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student "${cleanStudentName}" not found. Please create the student first.`,
      });
    }

    // ==================================================
    // FIND OR CREATE PARENT
    // ==================================================

    let parent = await prisma.parent.findFirst({
      where: {
        name: {
          equals: cleanParentName,
        },
      },
    });

    if (!parent) {
      parent = await prisma.parent.create({
        data: {
          name: cleanParentName,
        },
      });
    }

    // ==================================================
    // CREATE OR UPDATE RELATIONSHIP
    // ==================================================
    // If relationship already exists:
    // relation will be updated.
    //
    // If relationship does not exist:
    // new relationship will be created.
    // ==================================================

    const parentStudent = await prisma.parentStudent.upsert({
      where: {
        parentId_studentId: {
          parentId: parent.id,
          studentId: student.id,
        },
      },

      // Existing relationship
      update: {
        relation: cleanRelation,
      },

      // New relationship
      create: {
        parentId: parent.id,
        studentId: student.id,
        relation: cleanRelation,
      },

      // Return parent + student data
      include: {
        parent: true,
        student: true,
      },
    });

    // ==================================================
    // SUCCESS RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,
      message: "Parent-student relationship saved successfully",
      data: parentStudent,
    });
  } catch (error) {
    console.error("ADD / UPDATE PARENT STUDENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save parent-student relationship",
      error: error.message,
    });
  }
};

// ==================================================
// GET PARENT STUDENTS
// ==================================================

const getParentStudents = async (req, res) => {
  try {
    const parentId = parseInt(req.params.parentId);

    if (isNaN(parentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid parentId",
      });
    }

    // ==================================================
    // CHECK PARENT
    // ==================================================

    const parent = await prisma.parent.findUnique({
      where: {
        id: parentId,
      },
    });

    if (!parent) {
      return res.status(404).json({
        success: false,
        message: "Parent not found",
      });
    }

    // ==================================================
    // GET RELATIONSHIPS
    // ==================================================

    const relations = await prisma.parentStudent.findMany({
      where: {
        parentId,
      },

      include: {
        parent: true,
        student: true,
      },

      orderBy: {
        id: "asc",
      },
    });

    // ==================================================
    // SUCCESS RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,

      parent: {
        id: parent.id,
        name: parent.name,
        email: parent.email,
        phone: parent.phone,
      },

      count: relations.length,

      data: relations,
    });
  } catch (error) {
    console.error("GET PARENT STUDENTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get parent students",
      error: error.message,
    });
  }
};

// ==================================================
// REMOVE STUDENT FROM PARENT
// ==================================================

const removeStudentFromParent = async (req, res) => {
  try {
    const parentId = parseInt(req.params.parentId);
    const studentId = parseInt(req.params.studentId);

    // ==================================================
    // VALIDATION
    // ==================================================

    if (isNaN(parentId) || isNaN(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid parentId or studentId",
      });
    }

    // ==================================================
    // CHECK RELATIONSHIP
    // ==================================================

    const relation = await prisma.parentStudent.findUnique({
      where: {
        parentId_studentId: {
          parentId,
          studentId,
        },
      },
    });

    if (!relation) {
      return res.status(404).json({
        success: false,
        message: "Parent-student relationship not found",
      });
    }

    // ==================================================
    // DELETE RELATIONSHIP
    // ==================================================

    await prisma.parentStudent.delete({
      where: {
        parentId_studentId: {
          parentId,
          studentId,
        },
      },
    });

    // ==================================================
    // SUCCESS RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,
      message: "Student removed from parent successfully",
    });
  } catch (error) {
    console.error("REMOVE STUDENT FROM PARENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove parent-student relationship",
      error: error.message,
    });
  }
};

// ==================================================
// EXPORTS
// ==================================================

module.exports = {
  addStudentToParent,
  getParentStudents,
  removeStudentFromParent,
};