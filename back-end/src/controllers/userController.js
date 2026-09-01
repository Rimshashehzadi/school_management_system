
const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");

// ==================================================
// CREATE USER
// ==================================================

const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    // Validate role
    const allowedRoles = ["ADMIN", "TEACHER", "PARENT"];

    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    // Check existing email
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "PARENT",
      },
    });

    // Never return password
    const { password: _, ...userWithoutPassword } = user;

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error("CREATE USER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: error.message,
    });
  }
};

// ==================================================
// GET ALL USERS
// ==================================================

const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        id: "asc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("GET USERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get users",
      error: error.message,
    });
  }
};

// ==================================================
// GET USER BY ID
// ==================================================

const getUserById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("GET USER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get user",
      error: error.message,
    });
  }
};

// ==================================================
// UPDATE USER
// ==================================================

const updateUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, email, password, role } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Validate role
    const allowedRoles = ["ADMIN", "TEACHER", "PARENT"];

    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    // If email is changing, check duplicate
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: "Email is already in use",
        });
      }
    }

    const updateData = {};

    if (name !== undefined) {
      updateData.name = name;
    }

    if (email !== undefined) {
      updateData.email = email;
    }

    if (role !== undefined) {
      updateData.role = role;
    }

    // Hash new password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: {
        id,
      },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("UPDATE USER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error.message,
    });
  }
};

// ==================================================
// DELETE USER
// ==================================================

const deleteUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await prisma.user.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};

