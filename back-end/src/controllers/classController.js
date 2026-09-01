const prisma = require("../config/prisma");

// ==========================================
// CREATE CLASS
// ==========================================

const createClass = async (req, res) => {
  try {
    const { name, section } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Class name is required",
      });
    }

    const newClass = await prisma.class.create({
      data: {
        name,
        section: section || null,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Class created successfully",
      data: newClass,
    });
  } catch (error) {
    console.error("Create Class Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create class",
      error: error.message,
    });
  }
};

// ==========================================
// GET ALL CLASSES
// ==========================================

const getClasses = async (req, res) => {
  try {
    const classes = await prisma.class.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      count: classes.length,
      data: classes,
    });
  } catch (error) {
    console.error("Get Classes Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get classes",
      error: error.message,
    });
  }
};

// ==========================================
// GET CLASS BY ID
// ==========================================

const getClassById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid class ID",
      });
    }

    const classData = await prisma.class.findUnique({
      where: {
        id,
      },
    });

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: classData,
    });
  } catch (error) {
    console.error("Get Class Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get class",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE CLASS
// ==========================================

const updateClass = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid class ID",
      });
    }

    const existingClass = await prisma.class.findUnique({
      where: {
        id,
      },
    });

    if (!existingClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    const { name, section } = req.body;

    const updatedClass = await prisma.class.update({
      where: {
        id,
      },
      data: {
        ...(name !== undefined && { name }),
        ...(section !== undefined && { section }),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Class updated successfully",
      data: updatedClass,
    });
  } catch (error) {
    console.error("Update Class Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update class",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE CLASS
// ==========================================

const deleteClass = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid class ID",
      });
    }

    const existingClass = await prisma.class.findUnique({
      where: {
        id,
      },
    });

    if (!existingClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    await prisma.class.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Class deleted successfully",
    });
  } catch (error) {
    console.error("Delete Class Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete class",
      error: error.message,
    });
  }
};

module.exports = {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass,
};