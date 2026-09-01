const prisma = require("../config/prisma");

// ========================================
// CREATE FEE
// ========================================
const createFee = async (req, res) => {
  try {
    const {
      studentId,
      amount,
      paidAmount,
      dueDate,
      status,
    } = req.body;

    // Validation
    if (
      studentId === undefined ||
      amount === undefined ||
      paidAmount === undefined ||
      !dueDate ||
      !status
    ) {
      return res.status(400).json({
        success: false,
        message:
          "studentId, amount, paidAmount, dueDate and status are required",
      });
    }

    const parsedStudentId = parseInt(studentId);

    if (isNaN(parsedStudentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    // Validate amounts
    const feeAmount = Number(amount);
    const feePaidAmount = Number(paidAmount);

    if (isNaN(feeAmount) || feeAmount < 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a valid positive number",
      });
    }

    if (isNaN(feePaidAmount) || feePaidAmount < 0) {
      return res.status(400).json({
        success: false,
        message: "Paid amount must be a valid positive number",
      });
    }

    if (feePaidAmount > feeAmount) {
      return res.status(400).json({
        success: false,
        message: "Paid amount cannot be greater than total amount",
      });
    }

    // Validate status
    const validStatuses = [
      "PENDING",
      "PAID",
      "PARTIAL",
      "OVERDUE",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid fee status",
        allowedStatuses: validStatuses,
      });
    }

    // Check student
    const student = await prisma.student.findUnique({
      where: {
        id: parsedStudentId,
      },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Create fee
    const fee = await prisma.fee.create({
      data: {
        studentId: parsedStudentId,
        amount: feeAmount,
        paidAmount: feePaidAmount,
        dueDate: new Date(dueDate),
        status,
      },
      include: {
        student: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Fee created successfully",
      data: fee,
    });
  } catch (error) {
    console.error("CREATE FEE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create fee",
      error: error.message,
    });
  }
};

// ========================================
// GET ALL FEES
// ========================================
const getFees = async (req, res) => {
  try {
    const fees = await prisma.fee.findMany({
      include: {
        student: true,
      },
      orderBy: {
        dueDate: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: fees.length,
      data: fees,
    });
  } catch (error) {
    console.error("GET FEES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch fees",
      error: error.message,
    });
  }
};

// ========================================
// GET FEE BY ID
// ========================================
const getFeeById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid fee ID",
      });
    }

    const fee = await prisma.fee.findUnique({
      where: {
        id,
      },
      include: {
        student: true,
      },
    });

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: "Fee not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: fee,
    });
  } catch (error) {
    console.error("GET FEE BY ID ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch fee",
      error: error.message,
    });
  }
};

// ========================================
// GET FEES BY STUDENT
// ========================================
const getFeesByStudent = async (req, res) => {
  try {
    const studentId = parseInt(req.params.studentId);

    if (isNaN(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

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

    const fees = await prisma.fee.findMany({
      where: {
        studentId,
      },
      orderBy: {
        dueDate: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      student,
      count: fees.length,
      data: fees,
    });
  } catch (error) {
    console.error("GET STUDENT FEES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch student fees",
      error: error.message,
    });
  }
};

// ========================================
// UPDATE FEE
// ========================================
const updateFee = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid fee ID",
      });
    }

    const {
      amount,
      paidAmount,
      dueDate,
      status,
    } = req.body;

    // Check existing fee
    const existingFee = await prisma.fee.findUnique({
      where: {
        id,
      },
    });

    if (!existingFee) {
      return res.status(404).json({
        success: false,
        message: "Fee not found",
      });
    }

    // Determine updated values
    const updatedAmount =
      amount !== undefined
        ? Number(amount)
        : Number(existingFee.amount);

    const updatedPaidAmount =
      paidAmount !== undefined
        ? Number(paidAmount)
        : Number(existingFee.paidAmount);

    // Validate amounts
    if (isNaN(updatedAmount) || updatedAmount < 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a valid positive number",
      });
    }

    if (isNaN(updatedPaidAmount) || updatedPaidAmount < 0) {
      return res.status(400).json({
        success: false,
        message: "Paid amount must be a valid positive number",
      });
    }

    if (updatedPaidAmount > updatedAmount) {
      return res.status(400).json({
        success: false,
        message: "Paid amount cannot be greater than total amount",
      });
    }

    // Validate status if provided
    if (status !== undefined) {
      const validStatuses = [
        "PENDING",
        "PAID",
        "PARTIAL",
        "OVERDUE",
      ];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid fee status",
          allowedStatuses: validStatuses,
        });
      }
    }

    const fee = await prisma.fee.update({
      where: {
        id,
      },
      data: {
        ...(amount !== undefined && {
          amount: updatedAmount,
        }),

        ...(paidAmount !== undefined && {
          paidAmount: updatedPaidAmount,
        }),

        ...(dueDate !== undefined && {
          dueDate: new Date(dueDate),
        }),

        ...(status !== undefined && {
          status,
        }),
      },
      include: {
        student: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Fee updated successfully",
      data: fee,
    });
  } catch (error) {
    console.error("UPDATE FEE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update fee",
      error: error.message,
    });
  }
};

// ========================================
// DELETE FEE
// ========================================
const deleteFee = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid fee ID",
      });
    }

    const existingFee = await prisma.fee.findUnique({
      where: {
        id,
      },
    });

    if (!existingFee) {
      return res.status(404).json({
        success: false,
        message: "Fee not found",
      });
    }

    await prisma.fee.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Fee deleted successfully",
    });
  } catch (error) {
    console.error("DELETE FEE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete fee",
      error: error.message,
    });
  }
};

module.exports = {
  createFee,
  getFees,
  getFeeById,
  getFeesByStudent,
  updateFee,
  deleteFee,
};