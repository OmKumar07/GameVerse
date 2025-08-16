const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", async (req, res) => {
  try {
    const { email, username, password, displayName } = req.body;

    // Validation
    if (!email || !username || !password || !displayName) {
      return res.status(400).json({
        error: "Validation Error",
        message: "All fields are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      const field = existingUser.email === email ? "email" : "username";
      return res.status(400).json({
        error: "User Already Exists",
        message: `A user with this ${field} already exists`,
      });
    }

    // Create new user
    const user = new User({
      email,
      username,
      password,
      displayName,
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Update login stats
    await user.updateLoginStats();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error("Registration error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation Error",
        message: Object.values(error.errors)
          .map((err) => err.message)
          .join(", "),
      });
    }

    res.status(500).json({
      error: "Registration Failed",
      message: "Unable to create user account",
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: "Validation Error",
        message: "Email and password are required",
      });
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        error: "Authentication Failed",
        message: "Invalid email or password",
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        error: "Account Disabled",
        message: "Your account has been disabled. Please contact support.",
      });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Authentication Failed",
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Update login stats
    await user.updateLoginStats();

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Login Failed",
      message: "Unable to process login request",
    });
  }
});

// @route   POST /api/auth/verify-token
// @desc    Verify JWT token and return user data
// @access  Private
router.post("/verify-token", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(401).json({
        error: "No Token",
        message: "Access token is required",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({
        error: "Invalid Token",
        message: "Token is invalid or user not found",
      });
    }

    res.json({
      success: true,
      valid: true,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error("Token verification error:", error);

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        error: "Invalid Token",
        message: "Token is invalid or expired",
      });
    }

    res.status(500).json({
      error: "Verification Failed",
      message: "Unable to verify token",
    });
  }
});

// @route   POST /api/auth/refresh-token
// @desc    Refresh JWT token
// @access  Private
router.post("/refresh-token", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(401).json({
        error: "No Token",
        message: "Refresh token is required",
      });
    }

    // Verify current token (even if expired)
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      ignoreExpiration: true,
    });

    // Find user
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({
        error: "Invalid Token",
        message: "User not found or inactive",
      });
    }

    // Generate new token
    const newToken = generateToken(user._id);

    res.json({
      success: true,
      message: "Token refreshed successfully",
      token: newToken,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    res.status(401).json({
      error: "Refresh Failed",
      message: "Unable to refresh token",
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Public
router.post("/logout", (req, res) => {
  res.json({
    success: true,
    message: "Logout successful",
  });
});

module.exports = router;
