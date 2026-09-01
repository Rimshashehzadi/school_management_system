const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // User must be authenticated first
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized. Please login first",
        });
      }

      // Check user's role
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Access denied. You do not have permission",
          requiredRoles: allowedRoles,
          yourRole: req.user.role,
        });
      }

      next();
    } catch (error) {
      console.error("ROLE MIDDLEWARE ERROR:", error);

      return res.status(500).json({
        success: false,
        message: "Role authorization failed",
        error: error.message,
      });
    }
  };
};

module.exports = authorizeRoles;