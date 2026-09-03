
const prisma = require("../config/prisma");

// ===============================
// CREATE SUBJECT
// ===============================
const createSubject = async (req, res) => {
  try {
    const { name, code } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Subject name is required",
      });
    }

    const subjectName = name.trim();

    // ==========================================
    // CHECK IF SUBJECT WITH SAME NAME EXISTS
    // ==========================================

    const existingByName = await prisma.subject.findFirst({
      where: {
        name: {
          equals: subjectName,
        },
      },
    });

    if (existingByName) {
      return res.status(200).json({
        success: true,
        message: "Subject already exists",
        data: existingByName,
        existing: true,
      });
    }

    // ==========================================
    // GENERATE CODE IF NOT PROVIDED
    // ==========================================

    let subjectCode = code?.trim();

    if (!subjectCode) {
      const baseCode = subjectName
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 8);

      subjectCode = baseCode || "SUB";

      let counter = 1;
      let finalCode = subjectCode;

      while (
        await prisma.subject.findUnique({
          where: {
            code: finalCode,
          },
        })
      ) {
        finalCode = `${subjectCode}${counter}`;
        counter++;
      }

      subjectCode = finalCode;
    }

    // ==========================================
    // CHECK DUPLICATE CODE
    // ==========================================

    const existingByCode = await prisma.subject.findUnique({
      where: {
        code: subjectCode,
      },
    });

    if (existingByCode) {
      return res.status(409).json({
        success: false,
        message: "Subject code already exists",
      });
    }

    // ==========================================
    // CREATE SUBJECT
    // ==========================================

    const subject = await prisma.subject.create({
      data: {
        name: subjectName,
        code: subjectCode,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Subject created successfully",
      data: subject,
      existing: false,
    });
  } catch (error) {
    console.error("CREATE SUBJECT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create subject",
      error: error.message,
    });
  }
};

// ===============================
// GET ALL SUBJECTS
// ===============================
const getSubjects = async (req, res) => {
  try {
    const subjects = await prisma.subject.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      count: subjects.length,
      data: subjects,
    });
  } catch (error) {
    console.error("GET SUBJECTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch subjects",
      error: error.message,
    });
  }
};

// ===============================
// GET SUBJECT BY ID
// ===============================
const getSubjectById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Subject ID",
      });
    }

    const subject = await prisma.subject.findUnique({
      where: {
        id,
      },
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: subject,
    });
  } catch (error) {
    console.error("GET SUBJECT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch subject",
      error: error.message,
    });
  }
};

module.exports = {
  createSubject,
  getSubjects,
  getSubjectById,
};

