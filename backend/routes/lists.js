const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// Get all custom lists for the authenticated user
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("customLists");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      data: user.customLists.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      ),
    });
  } catch (error) {
    console.error("Error fetching custom lists:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch custom lists",
    });
  }
});

// Get a specific custom list
router.get("/:listId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("customLists");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const list = user.customLists.find((list) => list.id === req.params.listId);

    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    res.json({
      success: true,
      data: list,
    });
  } catch (error) {
    console.error("Error fetching custom list:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch custom list",
    });
  }
});

// Create a new custom list
router.post("/", auth, async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "List name is required",
      });
    }

    if (name.length > 50) {
      return res.status(400).json({
        success: false,
        message: "List name cannot exceed 50 characters",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user already has a list with this name
    const existingList = user.customLists.find(
      (list) => list.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (existingList) {
      return res.status(400).json({
        success: false,
        message: "A list with this name already exists",
      });
    }

    const newList = await user.createCustomList({
      name: name.trim(),
      description: description?.trim() || "",
      isPublic: Boolean(isPublic),
    });

    res.status(201).json({
      success: true,
      message: "Custom list created successfully",
      data: newList,
    });
  } catch (error) {
    console.error("Error creating custom list:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create custom list",
    });
  }
});

// Update a custom list
router.patch("/:listId", auth, async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;
    const listId = req.params.listId;

    if (name && name.length > 50) {
      return res.status(400).json({
        success: false,
        message: "List name cannot exceed 50 characters",
      });
    }

    if (description && description.length > 200) {
      return res.status(400).json({
        success: false,
        message: "List description cannot exceed 200 characters",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if list exists
    const list = user.customLists.find((list) => list.id === listId);
    if (!list) {
      return res.status(404).json({
        success: false,
        message: "List not found",
      });
    }

    // Check for duplicate name (excluding current list)
    if (name && name.trim().toLowerCase() !== list.name.toLowerCase()) {
      const existingList = user.customLists.find(
        (l) =>
          l.id !== listId && l.name.toLowerCase() === name.trim().toLowerCase()
      );

      if (existingList) {
        return res.status(400).json({
          success: false,
          message: "A list with this name already exists",
        });
      }
    }

    await user.updateCustomList(listId, {
      name: name?.trim(),
      description: description?.trim(),
      isPublic,
    });

    // Get updated list
    const updatedUser = await User.findById(req.user.id).select("customLists");
    const updatedList = updatedUser.customLists.find(
      (list) => list.id === listId
    );

    res.json({
      success: true,
      message: "Custom list updated successfully",
      data: updatedList,
    });
  } catch (error) {
    console.error("Error updating custom list:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update custom list",
    });
  }
});

// Delete a custom list
router.delete("/:listId", auth, async (req, res) => {
  try {
    const listId = req.params.listId;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if list exists
    const list = user.customLists.find((list) => list.id === listId);
    if (!list) {
      return res.status(404).json({
        success: false,
        message: "List not found",
      });
    }

    await user.deleteCustomList(listId);

    res.json({
      success: true,
      message: "Custom list deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting custom list:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete custom list",
    });
  }
});

// Add a game to a custom list
router.post("/:listId/games", auth, async (req, res) => {
  try {
    const { gameId, gameName, gameImage } = req.body;
    const listId = req.params.listId;

    if (!gameId || !gameName) {
      return res.status(400).json({
        success: false,
        message: "Game ID and name are required",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.addGameToList(listId, {
      gameId: parseInt(gameId),
      gameName,
      gameImage,
    });

    // Get updated list
    const updatedUser = await User.findById(req.user.id).select("customLists");
    const updatedList = updatedUser.customLists.find(
      (list) => list.id === listId
    );

    res.json({
      success: true,
      message: "Game added to list successfully",
      data: updatedList,
    });
  } catch (error) {
    console.error("Error adding game to list:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to add game to list",
    });
  }
});

// Remove a game from a custom list
router.delete("/:listId/games/:gameId", auth, async (req, res) => {
  try {
    const listId = req.params.listId;
    const gameId = parseInt(req.params.gameId);

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.removeGameFromList(listId, gameId);

    // Get updated list
    const updatedUser = await User.findById(req.user.id).select("customLists");
    const updatedList = updatedUser.customLists.find(
      (list) => list.id === listId
    );

    res.json({
      success: true,
      message: "Game removed from list successfully",
      data: updatedList,
    });
  } catch (error) {
    console.error("Error removing game from list:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to remove game from list",
    });
  }
});

module.exports = router;
