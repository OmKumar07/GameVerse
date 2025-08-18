const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    // Basic Information
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [20, "Username cannot exceed 20 characters"],
      match: [
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't include password in queries by default
    },
    displayName: {
      type: String,
      required: [true, "Display name is required"],
      maxlength: [50, "Display name cannot exceed 50 characters"],
    },

    // Profile Information
    profileImage: {
      url: {
        type: String,
        default: function () {
          return `https://api.dicebear.com/7.x/avataaars/svg?seed=${this.username}`;
        },
      },
      publicId: String, // For Cloudinary
    },
    bio: {
      type: String,
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },
    location: {
      type: String,
      maxlength: [100, "Location cannot exceed 100 characters"],
    },
    website: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || validator.isURL(v);
        },
        message: "Please provide a valid URL",
      },
    },

    // Gaming Preferences
    favoriteGenres: [
      {
        type: String,
        maxlength: [50, "Genre name too long"],
      },
    ],
    gamingPlatforms: [
      {
        type: String,
        maxlength: [50, "Platform name too long"],
      },
    ],

    // Game Data
    favoriteGames: [
      {
        gameId: {
          type: Number,
          required: true,
        },
        gameName: {
          type: String,
          required: true,
        },
        gameImage: String,
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    playedGames: [
      {
        gameId: {
          type: Number,
          required: true,
        },
        gameName: {
          type: String,
          required: true,
        },
        gameImage: String,
        status: {
          type: String,
          enum: ["playing", "completed", "dropped", "plan-to-play"],
          default: "playing",
        },
        rating: {
          type: Number,
          min: 1,
          max: 10,
        },
        hoursPlayed: {
          type: Number,
          min: 0,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
        completedAt: Date,
      },
    ],

    // Custom Game Lists
    customLists: [
      {
        id: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
          maxlength: [50, "List name cannot exceed 50 characters"],
        },
        description: {
          type: String,
          maxlength: [200, "List description cannot exceed 200 characters"],
        },
        isPublic: {
          type: Boolean,
          default: false,
        },
        games: [
          {
            gameId: {
              type: Number,
              required: true,
            },
            gameName: {
              type: String,
              required: true,
            },
            gameImage: String,
            addedAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
        createdAt: {
          type: Date,
          default: Date.now,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Activity & Statistics
    totalGamesPlayed: {
      type: Number,
      default: 0,
    },
    totalHoursPlayed: {
      type: Number,
      default: 0,
    },
    achievementsUnlocked: {
      type: Number,
      default: 0,
    },

    // Privacy Settings
    profilePrivacy: {
      type: String,
      enum: ["public", "friends", "private"],
      default: "public",
    },
    showEmail: {
      type: Boolean,
      default: false,
    },
    showGameStats: {
      type: Boolean,
      default: true,
    },
    showFavoriteGames: {
      type: Boolean,
      default: true,
    },
    showPlayedGames: {
      type: Boolean,
      default: true,
    },
    showCustomLists: {
      type: Boolean,
      default: true,
    },
    showBio: {
      type: Boolean,
      default: true,
    },
    showLocation: {
      type: Boolean,
      default: true,
    },

    // Account Status
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastLoginAt: Date,
    loginCount: {
      type: Number,
      default: 0,
    },

    // Reset Password
    passwordResetToken: String,
    passwordResetExpires: Date,

    // Email Verification
    emailVerificationToken: String,
    emailVerificationExpires: Date,
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ createdAt: -1 });
userSchema.index({ "favoriteGames.gameId": 1 });

// Virtual fields
userSchema.virtual("favoriteGamesCount").get(function () {
  return this.favoriteGames.length;
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(
    this.password,
    parseInt(process.env.BCRYPT_ROUNDS) || 12
  );
  next();
});

// Update login statistics
userSchema.methods.updateLoginStats = function () {
  this.lastLoginAt = new Date();
  this.loginCount += 1;
  return this.save();
};

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Add game to favorites
userSchema.methods.addToFavorites = function (gameData) {
  const existingGame = this.favoriteGames.find(
    (game) => game.gameId === gameData.gameId
  );
  if (!existingGame) {
    this.favoriteGames.push(gameData);
  }
  return this.save();
};

// Remove game from favorites
userSchema.methods.removeFromFavorites = function (gameId) {
  this.favoriteGames = this.favoriteGames.filter(
    (game) => game.gameId !== gameId
  );
  return this.save();
};

// Add played game
userSchema.methods.addPlayedGame = function (gameData) {
  const existingGame = this.playedGames.find(
    (game) => game.gameId === gameData.gameId
  );
  if (existingGame) {
    Object.assign(existingGame, gameData);
  } else {
    this.playedGames.push(gameData);
    this.totalGamesPlayed += 1;
  }

  // Update total hours if provided
  if (gameData.hoursPlayed) {
    this.totalHoursPlayed += gameData.hoursPlayed;
  }

  return this.save();
};

// Custom Lists Methods
userSchema.methods.createCustomList = function (listData) {
  const newList = {
    id: require("crypto").randomUUID(),
    name: listData.name,
    description: listData.description || "",
    isPublic: listData.isPublic || false,
    games: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  this.customLists.push(newList);
  return this.save().then(() => newList);
};

userSchema.methods.updateCustomList = function (listId, updateData) {
  const list = this.customLists.find((list) => list.id === listId);
  if (!list) {
    throw new Error("List not found");
  }

  if (updateData.name) list.name = updateData.name;
  if (updateData.description !== undefined)
    list.description = updateData.description;
  if (updateData.isPublic !== undefined) list.isPublic = updateData.isPublic;
  list.updatedAt = new Date();

  return this.save();
};

userSchema.methods.deleteCustomList = function (listId) {
  this.customLists = this.customLists.filter((list) => list.id !== listId);
  return this.save();
};

userSchema.methods.addGameToList = function (listId, gameData) {
  const list = this.customLists.find((list) => list.id === listId);
  if (!list) {
    throw new Error("List not found");
  }

  const existingGame = list.games.find(
    (game) => game.gameId === gameData.gameId
  );
  if (!existingGame) {
    list.games.push({
      gameId: gameData.gameId,
      gameName: gameData.gameName,
      gameImage: gameData.gameImage,
      addedAt: new Date(),
    });
    list.updatedAt = new Date();
  }

  return this.save();
};

userSchema.methods.removeGameFromList = function (listId, gameId) {
  const list = this.customLists.find((list) => list.id === listId);
  if (!list) {
    throw new Error("List not found");
  }

  list.games = list.games.filter((game) => game.gameId !== gameId);
  list.updatedAt = new Date();

  return this.save();
};

// Get user's public profile
userSchema.methods.getPublicProfile = function (viewerUserId = null) {
  const publicProfile = this.toObject();

  // Remove sensitive information
  delete publicProfile.password;
  delete publicProfile.passwordResetToken;
  delete publicProfile.passwordResetExpires;
  delete publicProfile.emailVerificationToken;
  delete publicProfile.emailVerificationExpires;

  // Check if profile is private
  if (publicProfile.profilePrivacy === "private") {
    // Only show basic info for private profiles
    return {
      _id: publicProfile._id,
      username: publicProfile.username,
      displayName: publicProfile.displayName,
      profileImage: publicProfile.profileImage,
      profilePrivacy: publicProfile.profilePrivacy,
      isPrivate: true,
    };
  }

  // For friends-only profiles, show basic info (simplified for now)
  if (publicProfile.profilePrivacy === "friends") {
    return {
      _id: publicProfile._id,
      username: publicProfile.username,
      displayName: publicProfile.displayName,
      profileImage: publicProfile.profileImage,
      profilePrivacy: publicProfile.profilePrivacy,
      isFriendsOnly: true,
    };
  }

  // Apply privacy settings for public profiles
  if (!publicProfile.showEmail) {
    delete publicProfile.email;
  }

  if (!publicProfile.showBio) {
    delete publicProfile.bio;
  }

  if (!publicProfile.showLocation) {
    delete publicProfile.location;
  }

  if (!publicProfile.showGameStats) {
    delete publicProfile.totalGamesPlayed;
    delete publicProfile.totalHoursPlayed;
    delete publicProfile.achievementsUnlocked;
  }

  if (!publicProfile.showFavoriteGames) {
    delete publicProfile.favoriteGames;
  }

  if (!publicProfile.showPlayedGames) {
    delete publicProfile.playedGames;
  }

  if (!publicProfile.showCustomLists) {
    publicProfile.customLists = [];
  } else {
    // Only show public custom lists
    publicProfile.customLists = publicProfile.customLists.filter(
      (list) => list.isPublic
    );
  }

  return publicProfile;
};

module.exports = mongoose.model("User", userSchema);
