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

    // Social Features
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

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
userSchema.virtual("followersCount").get(function () {
  return this.followers.length;
});

userSchema.virtual("followingCount").get(function () {
  return this.following.length;
});

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

// Get user's public profile
userSchema.methods.getPublicProfile = function () {
  const publicProfile = this.toObject();

  // Remove sensitive information
  delete publicProfile.password;
  delete publicProfile.passwordResetToken;
  delete publicProfile.passwordResetExpires;
  delete publicProfile.emailVerificationToken;
  delete publicProfile.emailVerificationExpires;

  // Conditionally remove email based on privacy settings
  if (!publicProfile.showEmail) {
    delete publicProfile.email;
  }

  return publicProfile;
};

module.exports = mongoose.model("User", userSchema);
