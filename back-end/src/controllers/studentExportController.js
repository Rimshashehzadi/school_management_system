const prisma = require("../config/prisma");
const {
  jsonToCsv,
  jsonToExcel,
} = require("../utils/fileHelper");

// ===============================
// EXPORT STUDENTS AS CSV
// ===============================

const exportStudentsCsv = async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      orderBy: {
        id: "asc",
      },
    });

    const data = students.map((student) => ({
      id: student.id,
      name: student.name,
      email: student.email || "",
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
    }));

    const csv = jsonToCsv(data);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="students.csv"'
    );

    return res.status(200).send(csv);
  } catch (error) {
    console.error("EXPORT STUDENTS CSV ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to export students",
      error: error.message,
    });
  }
};

// ===============================
// EXPORT STUDENTS AS EXCEL
// ===============================

const exportStudentsExcel = async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      orderBy: {
        id: "asc",
      },
    });

    const data = students.map((student) => ({
      id: student.id,
      name: student.name,
      email: student.email || "",
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
    }));

    const excelBuffer = jsonToExcel(data, "Students");

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="students.xlsx"'
    );

    return res.status(200).send(excelBuffer);
  } catch (error) {
    console.error("EXPORT STUDENTS EXCEL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to export students",
      error: error.message,
    });
  }
};

module.exports = {
  exportStudentsCsv,
  exportStudentsExcel,
};