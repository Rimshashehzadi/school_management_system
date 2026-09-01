const prisma = require("../config/prisma");
const { excelToJson } = require("../utils/fileHelper");

const importStudents = async (req, res) => {
  try {
    // Check uploaded file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "CSV or Excel file is required",
      });
    }

    // Convert file to JSON
    const rows = excelToJson(req.file.buffer);

    if (!rows.length) {
      return res.status(400).json({
        success: false,
        message: "File is empty",
      });
    }

    const students = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      const name = row.name;
      const email = row.email;

      // Validate name
      if (!name) {
        return res.status(400).json({
          success: false,
          message: `Name is missing at row ${i + 2}`,
        });
      }

      // Validate email
      if (!email) {
        return res.status(400).json({
          success: false,
          message: `Email is missing at row ${i + 2}`,
        });
      }

      students.push({
        name: String(name).trim(),
        email: String(email).trim(),
      });
    }

    // Create students
    const createdStudents = [];

    for (const student of students) {
      const existingStudent = await prisma.student.findUnique({
        where: {
          email: student.email,
        },
      });

      if (existingStudent) {
        continue;
      }

      const newStudent = await prisma.student.create({
        data: student,
      });

      createdStudents.push(newStudent);
    }

    return res.status(201).json({
      success: true,
      message: "Students imported successfully",
      importedCount: createdStudents.length,
      skippedCount: students.length - createdStudents.length,
      data: createdStudents,
    });
  } catch (error) {
    console.error("IMPORT STUDENTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to import students",
      error: error.message,
    });
  }
};

module.exports = {
  importStudents,
};