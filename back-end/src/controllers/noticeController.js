const prisma = require("../config/prisma");

// ==================================================
// CREATE NOTICE
// ==================================================

const createNotice = async (req, res) => {
  try {
    const { title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: "Title and message are required",
      });
    }

    const notice = await prisma.notice.create({
      data: {
        title,
        message,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Notice created successfully",
      data: notice,
    });
  } catch (error) {
    console.error("CREATE NOTICE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create notice",
      error: error.message,
    });
  }
};

// ==================================================
// GET ALL NOTICES
// ==================================================

const getNotices = async (req, res) => {
  try {
    const notices = await prisma.notice.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: notices.length,
      data: notices,
    });
  } catch (error) {
    console.error("GET NOTICES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get notices",
      error: error.message,
    });
  }
};

// ==================================================
// GET NOTICE BY ID
// ==================================================

const getNoticeById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notice ID",
      });
    }

    const notice = await prisma.notice.findUnique({
      where: {
        id,
      },
    });

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: notice,
    });
  } catch (error) {
    console.error("GET NOTICE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get notice",
      error: error.message,
    });
  }
};

// ==================================================
// UPDATE NOTICE
// ==================================================

const updateNotice = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, message } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notice ID",
      });
    }

    const existingNotice = await prisma.notice.findUnique({
      where: {
        id,
      },
    });

    if (!existingNotice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    if (!title && !message) {
      return res.status(400).json({
        success: false,
        message: "Title or message is required",
      });
    }

    const notice = await prisma.notice.update({
      where: {
        id,
      },
      data: {
        ...(title !== undefined && { title }),
        ...(message !== undefined && { message }),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Notice updated successfully",
      data: notice,
    });
  } catch (error) {
    console.error("UPDATE NOTICE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update notice",
      error: error.message,
    });
  }
};

// ==================================================
// DELETE NOTICE
// ==================================================

const deleteNotice = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notice ID",
      });
    }

    const existingNotice = await prisma.notice.findUnique({
      where: {
        id,
      },
    });

    if (!existingNotice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    await prisma.notice.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Notice deleted successfully",
    });
  } catch (error) {
    console.error("DELETE NOTICE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete notice",
      error: error.message,
    });
  }
};

module.exports = {
  createNotice,
  getNotices,
  getNoticeById,
  updateNotice,
  deleteNotice,
};