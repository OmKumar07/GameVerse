const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Access Denied",
        message: "No token provided or invalid token format",
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists and is active
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({
        error: "Access Denied",
        message: "Token is invalid or user no longer exists",
      });
    }

    // Add user info to request
    req.user = {
      userId: decoded.userId,
      email: user.email,
      username: user.username,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        error: "Access Denied",
        message: "Invalid token",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Access Denied",
        message: "Token expired",
      });
    }

    res.status(500).json({
      error: "Authentication Error",
      message: "Unable to authenticate request",
    });
  }
};

module.exports = auth;
