const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get current user's profile
// @access  Private
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate("followers", "username displayName profileImage")
      .populate("following", "username displayName profileImage");

    if (!user) {
      return res.status(404).json({
        error: "User Not Found",
        message: "User profile not found",
      });
    }

    res.json({
      success: true,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      error: "Profile Fetch Failed",
      message: "Unable to fetch user profile",
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", auth, async (req, res) => {
  try {
    const {
      displayName,
      bio,
      location,
      website,
      favoriteGenres,
      gamingPlatforms,
      profilePrivacy,
      showEmail,
      showGameStats,
    } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        error: "User Not Found",
        message: "User not found",
      });
    }

    // Update allowed fields
    if (displayName !== undefined) user.displayName = displayName;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (website !== undefined) user.website = website;
    if (favoriteGenres !== undefined) user.favoriteGenres = favoriteGenres;
    if (gamingPlatforms !== undefined) user.gamingPlatforms = gamingPlatforms;
    if (profilePrivacy !== undefined) user.profilePrivacy = profilePrivacy;
    if (showEmail !== undefined) user.showEmail = showEmail;
    if (showGameStats !== undefined) user.showGameStats = showGameStats;

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error("Update profile error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation Error",
        message: Object.values(error.errors)
          .map((err) => err.message)
          .join(", "),
      });
    }

    res.status(500).json({
      error: "Profile Update Failed",
      message: "Unable to update profile",
    });
  }
});

// @route   POST /api/users/upload-avatar
// @desc    Upload profile avatar
// @access  Private
router.post(
  "/upload-avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: "No File",
          message: "Please select an image to upload",
        });
      }

      const user = await User.findById(req.user.userId);

      if (!user) {
        return res.status(404).json({
          error: "User Not Found",
          message: "User not found",
        });
      }

      // Update profile image
      user.profileImage = {
        url: req.file.path, // Cloudinary URL
        publicId: req.file.filename, // Cloudinary public ID
      };

      await user.save();

      res.json({
        success: true,
        message: "Profile image updated successfully",
        profileImage: user.profileImage,
      });
    } catch (error) {
      console.error("Avatar upload error:", error);
      res.status(500).json({
        error: "Upload Failed",
        message: "Unable to upload profile image",
      });
    }
  }
);

// @route   POST /api/users/favorites
// @desc    Add game to favorites
// @access  Private
router.post("/favorites", auth, async (req, res) => {
  try {
    const { gameId, gameName, gameImage } = req.body;

    if (!gameId || !gameName) {
      return res.status(400).json({
        error: "Missing Data",
        message: "Game ID and name are required",
      });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        error: "User Not Found",
        message: "User not found",
      });
    }

    await user.addToFavorites({ gameId, gameName, gameImage });

    res.json({
      success: true,
      message: "Game added to favorites",
      favoriteGames: user.favoriteGames,
    });
  } catch (error) {
    console.error("Add favorite error:", error);
    res.status(500).json({
      error: "Failed to Add Favorite",
      message: "Unable to add game to favorites",
    });
  }
});

// @route   DELETE /api/users/favorites/:gameId
// @desc    Remove game from favorites
// @access  Private
router.delete("/favorites/:gameId", auth, async (req, res) => {
  try {
    const { gameId } = req.params;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        error: "User Not Found",
        message: "User not found",
      });
    }

    await user.removeFromFavorites(parseInt(gameId));

    res.json({
      success: true,
      message: "Game removed from favorites",
      favoriteGames: user.favoriteGames,
    });
  } catch (error) {
    console.error("Remove favorite error:", error);
    res.status(500).json({
      error: "Failed to Remove Favorite",
      message: "Unable to remove game from favorites",
    });
  }
});

// @route   POST /api/users/played-games
// @desc    Add/update played game
// @access  Private
router.post("/played-games", auth, async (req, res) => {
  try {
    const { gameId, gameName, gameImage, status, rating, hoursPlayed } =
      req.body;

    if (!gameId || !gameName) {
      return res.status(400).json({
        error: "Missing Data",
        message: "Game ID and name are required",
      });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        error: "User Not Found",
        message: "User not found",
      });
    }

    const gameData = {
      gameId,
      gameName,
      gameImage,
      status,
      rating,
      hoursPlayed,
    };

    if (status === "completed") {
      gameData.completedAt = new Date();
    }

    await user.addPlayedGame(gameData);

    res.json({
      success: true,
      message: "Game status updated",
      playedGames: user.playedGames,
    });
  } catch (error) {
    console.error("Add played game error:", error);
    res.status(500).json({
      error: "Failed to Update Game",
      message: "Unable to update game status",
    });
  }
});

// @route   GET /api/users/stats
// @desc    Get user gaming statistics
// @access  Private
router.get("/stats", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        error: "User Not Found",
        message: "User not found",
      });
    }

    const stats = {
      totalGamesPlayed: user.totalGamesPlayed,
      totalHoursPlayed: user.totalHoursPlayed,
      favoriteGamesCount: user.favoriteGames.length,
      followersCount: user.followers.length,
      followingCount: user.following.length,
      memberSince: user.createdAt,
      lastActive: user.lastLoginAt,
      gamesByStatus: {
        playing: user.playedGames.filter((g) => g.status === "playing").length,
        completed: user.playedGames.filter((g) => g.status === "completed")
          .length,
        dropped: user.playedGames.filter((g) => g.status === "dropped").length,
        planToPlay: user.playedGames.filter((g) => g.status === "plan-to-play")
          .length,
      },
      averageRating: user.playedGames
        .filter((g) => g.rating)
        .reduce((acc, g, i, arr) => acc + g.rating / arr.length, 0),
    };

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({
      error: "Stats Fetch Failed",
      message: "Unable to fetch user statistics",
    });
  }
});

// @route   GET /api/users/:username
// @desc    Get public user profile
// @access  Public
router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username })
      .populate("followers", "username displayName profileImage")
      .populate("following", "username displayName profileImage");

    if (!user) {
      return res.status(404).json({
        error: "User Not Found",
        message: "User not found",
      });
    }

    // Check privacy settings
    if (user.profilePrivacy === "private") {
      return res.status(403).json({
        error: "Private Profile",
        message: "This profile is private",
      });
    }

    const publicProfile = user.getPublicProfile();

    // Remove additional sensitive data based on privacy settings
    if (!user.showGameStats) {
      delete publicProfile.favoriteGames;
      delete publicProfile.playedGames;
      delete publicProfile.totalGamesPlayed;
      delete publicProfile.totalHoursPlayed;
    }

    res.json({
      success: true,
      user: publicProfile,
    });
  } catch (error) {
    console.error("Get public profile error:", error);
    res.status(500).json({
      error: "Profile Fetch Failed",
      message: "Unable to fetch user profile",
    });
  }
});

module.exports = router;
