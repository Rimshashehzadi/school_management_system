
const prisma = require("../config/prisma");

// ==================================================
// CREATE PARENT
// ==================================================

const createParent = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Parent name is required",
      });
    }

    const parent = await prisma.parent.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Parent created successfully",
      data: parent,
    });
  } catch (error) {
    console.error("CREATE PARENT ERROR:", error);

    // Duplicate email
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "A parent with this email already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create parent",
      error: error.message,
    });
  }
};

// ==================================================
// GET ALL PARENTS
// ==================================================

const getParents = async (req, res) => {
  try {
    const parents = await prisma.parent.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      count: parents.length,
      data: parents,
    });
  } catch (error) {
    console.error("GET PARENTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get parents",
      error: error.message,
    });
  }
};

// ==================================================
// GET PARENT BY ID
// ==================================================

const getParentById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid parent ID",
      });
    }

    const parent = await prisma.parent.findUnique({
      where: {
        id,
      },
      include: {
        parentStudents: {
          include: {
            student: true,
          },
        },
      },
    });

    if (!parent) {
      return res.status(404).json({
        success: false,
        message: "Parent not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: parent,
    });
  } catch (error) {
    console.error("GET PARENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get parent",
      error: error.message,
    });
  }
};

// ==================================================
// UPDATE PARENT
// ==================================================

const updateParent = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, email, phone } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid parent ID",
      });
    }

    const existingParent = await prisma.parent.findUnique({
      where: {
        id,
      },
    });

    if (!existingParent) {
      return res.status(404).json({
        success: false,
        message: "Parent not found",
      });
    }

    const parent = await prisma.parent.update({
      where: {
        id,
      },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email: email || null }),
        ...(phone !== undefined && { phone: phone || null }),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Parent updated successfully",
      data: parent,
    });
  } catch (error) {
    console.error("UPDATE PARENT ERROR:", error);

    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "A parent with this email already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update parent",
      error: error.message,
    });
  }
};

// ==================================================
// DELETE PARENT
// ==================================================

const deleteParent = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid parent ID",
      });
    }

    const existingParent = await prisma.parent.findUnique({
      where: {
        id,
      },
    });

    if (!existingParent) {
      return res.status(404).json({
        success: false,
        message: "Parent not found",
      });
    }

    await prisma.parent.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Parent deleted successfully",
    });
  } catch (error) {
    console.error("DELETE PARENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete parent",
      error: error.message,
    });
  }
};

module.exports = {
  createParent,
  getParents,
  getParentById,
  updateParent,
  deleteParent,
};

