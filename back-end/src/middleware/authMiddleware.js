const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    console.log("AUTHORIZATION HEADER:", req.headers.authorization);
    console.log("ALL HEADERS:", req.headers);

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Token is required",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid token format. Use Bearer token",
      });
    }

    const token = authHeader.substring(7).trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is empty",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT_SECRET is missing from .env",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    console.log("AUTHENTICATED USER:", req.user);

    next();
  } catch (error) {
    console.error("AUTH MIDDLEWARE ERROR:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: error.message,
    });
  }
};

module.exports = authMiddleware;