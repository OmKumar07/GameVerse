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
      showFavoriteGames,
      showPlayedGames,
      showCustomLists,
      showBio,
      showLocation,
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
    if (showFavoriteGames !== undefined)
      user.showFavoriteGames = showFavoriteGames;
    if (showPlayedGames !== undefined) user.showPlayedGames = showPlayedGames;
    if (showCustomLists !== undefined) user.showCustomLists = showCustomLists;
    if (showBio !== undefined) user.showBio = showBio;
    if (showLocation !== undefined) user.showLocation = showLocation;

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

// @route   GET /api/users/favorites
// @desc    Get user's favorite games
// @access  Private
router.get("/favorites", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        error: "User Not Found",
        message: "User not found",
      });
    }

    // Convert favoriteGames to frontend format
    const favorites = user.favoriteGames.map((fav) => ({
      id: fav.gameId,
      name: fav.gameName,
      background_image: fav.gameImage,
      parent_platforms: [], // Will be empty for favorites
      metacritic: null, // Will be null for favorites
    }));

    res.json({
      success: true,
      favorites,
    });
  } catch (error) {
    console.error("Get favorites error:", error);
    res.status(500).json({
      error: "Favorites Fetch Failed",
      message: "Unable to fetch favorite games",
    });
  }
});

// @route   POST /api/users/favorites
// @desc    Add game to favorites
// @access  Private
router.post("/favorites", auth, async (req, res) => {
  try {
    const { game } = req.body;

    if (!game || !game.id || !game.name) {
      return res.status(400).json({
        error: "Missing Data",
        message: "Game data with ID and name are required",
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
      gameId: game.id,
      gameName: game.name,
      gameImage: game.background_image || "",
    };

    await user.addToFavorites(gameData);

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

// @route   GET /api/users/played-games
// @desc    Get user's played games
// @access  Private
router.get("/played-games", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        error: "User Not Found",
        message: "User not found",
      });
    }

    res.json({
      success: true,
      playedGames: user.playedGames,
    });
  } catch (error) {
    console.error("Get played games error:", error);
    res.status(500).json({
      error: "Played Games Fetch Failed",
      message: "Unable to fetch played games",
    });
  }
});

// @route   DELETE /api/users/played-games/:gameId
// @desc    Remove game from played games
// @access  Private
router.delete("/played-games/:gameId", auth, async (req, res) => {
  try {
    const { gameId } = req.params;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        error: "User Not Found",
        message: "User not found",
      });
    }

    // Remove from played games
    user.playedGames = user.playedGames.filter(
      (game) => game.gameId !== parseInt(gameId)
    );

    await user.save();

    res.json({
      success: true,
      message: "Game removed from played games",
      playedGames: user.playedGames,
    });
  } catch (error) {
    console.error("Remove played game error:", error);
    res.status(500).json({
      error: "Failed to Remove Played Game",
      message: "Unable to remove game from played games",
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

// @route   POST /api/users/:userId/follow
// @desc    Follow a user
// @access  Private
router.post("/:userId/follow", auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.userId;

    // Check if trying to follow yourself
    if (userId === currentUserId) {
      return res.status(400).json({
        error: "Invalid Action",
        message: "You cannot follow yourself",
      });
    }

    // Find both users
    const userToFollow = await User.findById(userId);
    const currentUser = await User.findById(currentUserId);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({
        error: "User Not Found",
        message: "User not found",
      });
    }

    // Check if already following
    if (currentUser.following.includes(userId)) {
      return res.status(400).json({
        error: "Already Following",
        message: "You are already following this user",
      });
    }

    // Add to following/followers arrays
    currentUser.following.push(userId);
    userToFollow.followers.push(currentUserId);

    await currentUser.save();
    await userToFollow.save();

    res.json({
      success: true,
      message: "Successfully followed user",
      data: {
        followersCount: userToFollow.followers.length,
        followingCount: currentUser.following.length,
        isFollowing: true,
      },
    });
  } catch (error) {
    console.error("Follow user error:", error);
    res.status(500).json({
      error: "Follow Failed",
      message: "Unable to follow user",
    });
  }
});

// @route   DELETE /api/users/:userId/follow
// @desc    Unfollow a user
// @access  Private
router.delete("/:userId/follow", auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.userId;

    // Find both users
    const userToUnfollow = await User.findById(userId);
    const currentUser = await User.findById(currentUserId);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({
        error: "User Not Found",
        message: "User not found",
      });
    }

    // Check if not following
    if (!currentUser.following.includes(userId)) {
      return res.status(400).json({
        error: "Not Following",
        message: "You are not following this user",
      });
    }

    // Remove from following/followers arrays
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== userId
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== currentUserId
    );

    await currentUser.save();
    await userToUnfollow.save();

    res.json({
      success: true,
      message: "Successfully unfollowed user",
      data: {
        followersCount: userToUnfollow.followers.length,
        followingCount: currentUser.following.length,
        isFollowing: false,
      },
    });
  } catch (error) {
    console.error("Unfollow user error:", error);
    res.status(500).json({
      error: "Unfollow Failed",
      message: "Unable to unfollow user",
    });
  }
});

// @route   GET /api/users/:userId/follow-status
// @desc    Get follow status for a user
// @access  Private
router.get("/:userId/follow-status", auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.userId;

    // Find both users
    const targetUser = await User.findById(userId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({
        error: "User Not Found",
        message: "User not found",
      });
    }

    const isFollowing = currentUser.following.includes(userId);
    const isFollower = targetUser.following.includes(currentUserId);

    res.json({
      success: true,
      data: {
        isFollowing,
        isFollower,
        followersCount: targetUser.followers.length,
        followingCount: targetUser.following.length,
      },
    });
  } catch (error) {
    console.error("Get follow status error:", error);
    res.status(500).json({
      error: "Status Check Failed",
      message: "Unable to check follow status",
    });
  }
});

// @route   GET /api/users/followers
// @desc    Get user's followers list
// @access  Private
router.get("/followers", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate(
      "followers",
      "username displayName profileImage bio"
    );

    if (!user) {
      return res.status(404).json({
        error: "User Not Found",
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: {
        followers: user.followers,
        count: user.followers.length,
      },
    });
  } catch (error) {
    console.error("Get followers error:", error);
    res.status(500).json({
      error: "Followers Fetch Failed",
      message: "Unable to fetch followers",
    });
  }
});

// @route   GET /api/users/following
// @desc    Get user's following list
// @access  Private
router.get("/following", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate(
      "following",
      "username displayName profileImage bio"
    );

    if (!user) {
      return res.status(404).json({
        error: "User Not Found",
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: {
        following: user.following,
        count: user.following.length,
      },
    });
  } catch (error) {
    console.error("Get following error:", error);
    res.status(500).json({
      error: "Following Fetch Failed",
      message: "Unable to fetch following list",
    });
  }
});

module.exports = router;
