
const prisma = require("../config/prisma");

// ==================================================
// ADD STUDENT TO PARENT
// ==================================================

const addStudentToParent = async (req, res) => {
  try {
    const parentId = parseInt(req.params.parentId);
    const { studentId, relation } = req.body;

    // Validate parentId
    if (isNaN(parentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid parentId",
      });
    }

    // Validate studentId
    const studentIdInt = parseInt(studentId);

    if (isNaN(studentIdInt)) {
      return res.status(400).json({
        success: false,
        message: "Valid studentId is required",
      });
    }

    // Validate relation
    if (!relation) {
      return res.status(400).json({
        success: false,
        message: "Relation is required",
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
    // CHECK STUDENT
    // ==================================================

    const student = await prisma.student.findUnique({
      where: {
        id: studentIdInt,
      },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // ==================================================
    // CHECK EXISTING RELATIONSHIP
    // ==================================================

    const existingRelation = await prisma.parentStudent.findUnique({
      where: {
        parentId_studentId: {
          parentId,
          studentId: studentIdInt,
        },
      },
    });

    if (existingRelation) {
      return res.status(409).json({
        success: false,
        message: "Student is already linked to this parent",
      });
    }

    // ==================================================
    // CREATE RELATIONSHIP
    // ==================================================

    const parentStudent = await prisma.parentStudent.create({
      data: {
        parentId,
        studentId: studentIdInt,
        relation,
      },
      include: {
        parent: true,
        student: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Student linked to parent successfully",
      data: parentStudent,
    });
  } catch (error) {
    console.error("ADD STUDENT TO PARENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to link student to parent",
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

    // Check parent
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

    // Get relationships
    const relations = await prisma.parentStudent.findMany({
      where: {
        parentId,
      },
      include: {
        student: true,
      },
      orderBy: {
        id: "asc",
      },
    });

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

    if (isNaN(parentId) || isNaN(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid parentId or studentId",
      });
    }

    // Check relationship
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

    // Delete relationship
    await prisma.parentStudent.delete({
      where: {
        parentId_studentId: {
          parentId,
          studentId,
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Student removed from parent successfully",
    });
  } catch (error) {
    console.error("REMOVE STUDENT FROM PARENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove student from parent",
      error: error.message,
    });
  }
};

module.exports = {
  addStudentToParent,
  getParentStudents,
  removeStudentFromParent,
};

