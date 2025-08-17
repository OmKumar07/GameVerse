const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");
const router = express.Router();

// @route   GET /api/public/users/search
// @desc    Search for users by username or display name
// @access  Public
router.get("/users/search", async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        error: "Invalid Query",
        message: "Search query must be at least 2 characters long",
      });
    }

    const searchQuery = q.trim();
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Search by username or display name (case insensitive)
    const searchFilter = {
      $and: [
        { isActive: true }, // Only active users
        { profilePrivacy: { $ne: "private" } }, // Exclude private profiles from search
        {
          $or: [
            { username: { $regex: searchQuery, $options: "i" } },
            { displayName: { $regex: searchQuery, $options: "i" } },
          ],
        },
      ],
    };

    const users = await User.find(searchFilter)
      .select(
        "username displayName profileImage bio location profilePrivacy createdAt"
      )
      .sort({ username: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalUsers = await User.countDocuments(searchFilter);

    // Format user data for search results
    const searchResults = users.map((user) => ({
      _id: user._id,
      username: user.username,
      displayName: user.displayName,
      profileImage: user.profileImage,
      bio: user.showBio !== false ? user.bio : undefined,
      location: user.showLocation !== false ? user.location : undefined,
      profilePrivacy: user.profilePrivacy,
      memberSince: user.createdAt,
    }));

    res.json({
      success: true,
      data: {
        users: searchResults,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalUsers / parseInt(limit)),
          totalUsers,
          hasNextPage: skip + users.length < totalUsers,
          hasPrevPage: parseInt(page) > 1,
        },
      },
    });
  } catch (error) {
    console.error("User search error:", error);
    res.status(500).json({
      error: "Search Failed",
      message: "Unable to search users",
    });
  }
});

// @route   GET /api/public/users/:identifier
// @desc    Get public profile of a user by username or ID
// @access  Public (but can be enhanced with auth for friends-only profiles)
router.get("/users/:identifier", async (req, res) => {
  try {
    const { identifier } = req.params;
    let viewerUserId = null;

    // Check if there's an authenticated user viewing the profile
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const jwt = require("jsonwebtoken");
        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        viewerUserId = decoded.userId;
      } catch (err) {
        // Invalid token, continue as anonymous user
      }
    }

    // Find user by username or ID
    let user;
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      // It's a MongoDB ObjectId
      user = await User.findById(identifier);
    } else {
      // It's a username
      user = await User.findOne({ username: identifier });
    }

    if (!user || !user.isActive) {
      return res.status(404).json({
        error: "User Not Found",
        message: "The requested user does not exist or is inactive",
      });
    }

    // Get public profile based on privacy settings
    const publicProfile = user.getPublicProfile(viewerUserId);

    // Add some additional computed fields for the public view
    const enhancedProfile = {
      ...publicProfile,
      stats: {
        totalGamesPlayed: publicProfile.totalGamesPlayed || 0,
        totalHoursPlayed: publicProfile.totalHoursPlayed || 0,
        achievementsUnlocked: publicProfile.achievementsUnlocked || 0,
        favoriteGamesCount: publicProfile.favoriteGames?.length || 0,
        customListsCount: publicProfile.customLists?.length || 0,
        followersCount: publicProfile.followers?.length || 0,
        followingCount: publicProfile.following?.length || 0,
      },
      memberSince: publicProfile.createdAt,
      lastActive: publicProfile.lastLoginAt,
    };

    // Remove stats if not allowed to be shown
    if (!user.showGameStats) {
      delete enhancedProfile.stats.totalGamesPlayed;
      delete enhancedProfile.stats.totalHoursPlayed;
      delete enhancedProfile.stats.achievementsUnlocked;
    }

    if (!user.showFavoriteGames) {
      delete enhancedProfile.stats.favoriteGamesCount;
    }

    if (!user.showCustomLists) {
      delete enhancedProfile.stats.customListsCount;
    }

    res.json({
      success: true,
      data: enhancedProfile,
    });
  } catch (error) {
    console.error("Get public profile error:", error);
    res.status(500).json({
      error: "Profile Fetch Failed",
      message: "Unable to fetch user profile",
    });
  }
});

// @route   GET /api/public/users/:identifier/lists
// @desc    Get public lists of a user
// @access  Public
router.get("/users/:identifier/lists", async (req, res) => {
  try {
    const { identifier } = req.params;

    // Find user by username or ID
    let user;
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      user = await User.findById(identifier);
    } else {
      user = await User.findOne({ username: identifier });
    }

    if (!user || !user.isActive) {
      return res.status(404).json({
        error: "User Not Found",
        message: "The requested user does not exist or is inactive",
      });
    }

    // Check if user allows showing custom lists
    if (!user.showCustomLists || user.profilePrivacy === "private") {
      return res.status(403).json({
        error: "Access Denied",
        message: "This user's lists are not public",
      });
    }

    // Get only public lists
    const publicLists = user.customLists
      .filter((list) => list.isPublic)
      .map((list) => ({
        id: list.id,
        name: list.name,
        description: list.description,
        gamesCount: list.games.length,
        createdAt: list.createdAt,
        updatedAt: list.updatedAt,
        games: list.games.slice(0, 6), // Show only first 6 games as preview
      }))
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    res.json({
      success: true,
      data: {
        username: user.username,
        displayName: user.displayName,
        lists: publicLists,
        totalPublicLists: publicLists.length,
      },
    });
  } catch (error) {
    console.error("Get user lists error:", error);
    res.status(500).json({
      error: "Lists Fetch Failed",
      message: "Unable to fetch user lists",
    });
  }
});

// @route   GET /api/public/users/:identifier/lists/:listId
// @desc    Get details of a specific public list
// @access  Public
router.get("/users/:identifier/lists/:listId", async (req, res) => {
  try {
    const { identifier, listId } = req.params;

    // Find user by username or ID
    let user;
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      user = await User.findById(identifier);
    } else {
      user = await User.findOne({ username: identifier });
    }

    if (!user || !user.isActive) {
      return res.status(404).json({
        error: "User Not Found",
        message: "The requested user does not exist or is inactive",
      });
    }

    // Find the specific list
    const list = user.customLists.find((list) => list.id === listId);

    if (!list) {
      return res.status(404).json({
        error: "List Not Found",
        message: "The requested list does not exist",
      });
    }

    // Check if list is public
    if (
      !list.isPublic ||
      !user.showCustomLists ||
      user.profilePrivacy === "private"
    ) {
      return res.status(403).json({
        error: "Access Denied",
        message: "This list is not public",
      });
    }

    res.json({
      success: true,
      data: {
        list: {
          id: list.id,
          name: list.name,
          description: list.description,
          games: list.games,
          createdAt: list.createdAt,
          updatedAt: list.updatedAt,
          gamesCount: list.games.length,
        },
        owner: {
          username: user.username,
          displayName: user.displayName,
          profileImage: user.profileImage,
        },
      },
    });
  } catch (error) {
    console.error("Get list details error:", error);
    res.status(500).json({
      error: "List Fetch Failed",
      message: "Unable to fetch list details",
    });
  }
});

module.exports = router;
