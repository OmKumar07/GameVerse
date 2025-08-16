const express = require("express");
const router = express.Router();

// Simple game routes for caching and additional features
// This can be extended later for game reviews, ratings, etc.

// @route   GET /api/games/popular
// @desc    Get popular games (cached from RAWG)
// @access  Public
router.get("/popular", async (req, res) => {
  try {
    // This would typically cache popular games from RAWG API
    // For now, just return a success message
    res.json({
      success: true,
      message: "Popular games endpoint - to be implemented",
      games: [],
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch popular games",
      message: error.message,
    });
  }
});

// @route   GET /api/games/search
// @desc    Search games with caching
// @access  Public
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        error: "Search query required",
        message: "Please provide a search query",
      });
    }

    // This would implement search with caching
    res.json({
      success: true,
      message: "Game search endpoint - to be implemented",
      query: q,
      results: [],
    });
  } catch (error) {
    res.status(500).json({
      error: "Search failed",
      message: error.message,
    });
  }
});

module.exports = router;
