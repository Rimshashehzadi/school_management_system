const prisma = require("../config/prisma");

const getFeeReport = async (req, res) => {
  try {
    const studentId = parseInt(req.params.studentId);

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

    // Get all fees
    const fees = await prisma.fee.findMany({
      where: {
        studentId: studentId,
      },
      orderBy: {
        dueDate: "asc",
      },
    });

    // Calculate summary
    let totalAmount = 0;
    let totalPaid = 0;

    fees.forEach((fee) => {
      totalAmount += Number(fee.amount);
      totalPaid += Number(fee.paidAmount);
    });

    const remainingAmount = totalAmount - totalPaid;

    return res.status(200).json({
      success: true,
      message: "Fee report fetched successfully",
      data: {
        student: {
          id: student.id,
          name: student.name,
          email: student.email,
        },

        summary: {
          totalFees: fees.length,
          totalAmount,
          totalPaid,
          remainingAmount,
        },

        fees,
      },
    });
  } catch (error) {
    console.error("GET FEE REPORT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch fee report",
      error: error.message,
    });
  }
};

module.exports = {
  getFeeReport,
};