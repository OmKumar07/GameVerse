// Test script to create a sample user and verify structure
const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

async function createTestUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Create a test user with full structure
    const testUser = new User({
      email: "test@gameverse.com",
      username: "testgamer",
      password: "testpassword123",
      displayName: "Test Gamer",
      bio: "I love playing games and exploring new worlds!",
      location: "New York, USA",
      website: "https://testgamer.com",
      favoriteGenres: ["Action", "RPG", "Strategy"],
      gamingPlatforms: ["PC", "PlayStation", "Xbox"],
      favoriteGames: [
        {
          gameId: 3498,
          gameName: "Grand Theft Auto V",
          gameImage:
            "https://media.rawg.io/media/games/20a/20aa03a10cda45239fe22d035c0ebe64.jpg",
        },
        {
          gameId: 4200,
          gameName: "Portal 2",
          gameImage:
            "https://media.rawg.io/media/games/2ba/2bac0e87cf45e5b508f227d281c9252a.jpg",
        },
      ],
      playedGames: [
        {
          gameId: 4200,
          gameName: "Portal 2",
          gameImage:
            "https://media.rawg.io/media/games/2ba/2bac0e87cf45e5b508f227d281c9252a.jpg",
          status: "completed",
          rating: 9,
          hoursPlayed: 45,
          completedAt: new Date("2025-08-15"),
        },
        {
          gameId: 3498,
          gameName: "Grand Theft Auto V",
          gameImage:
            "https://media.rawg.io/media/games/20a/20aa03a10cda45239fe22d035c0ebe64.jpg",
          status: "playing",
          rating: 8,
          hoursPlayed: 120,
        },
      ],
      totalGamesPlayed: 2,
      totalHoursPlayed: 165,
      achievementsUnlocked: 45,
      profilePrivacy: "public",
      showEmail: false,
      showGameStats: true,
    });

    // Save the user
    const savedUser = await testUser.save();
    console.log("✅ Test user created successfully!");
    console.log("📊 User Structure:");
    console.log(JSON.stringify(savedUser.toObject(), null, 2));

    // Verify indexes were created
    const indexes = await User.collection.getIndexes();
    console.log("\n🔍 Database Indexes Created:");
    console.log(Object.keys(indexes));

    // Test virtual fields
    console.log("\n📈 Virtual Fields:");
    console.log(`Followers Count: ${savedUser.followersCount}`);
    console.log(`Following Count: ${savedUser.followingCount}`);
    console.log(`Favorite Games Count: ${savedUser.favoriteGamesCount}`);

    // Test methods
    console.log("\n🔒 Password Comparison Test:");
    const isPasswordValid = await savedUser.comparePassword("testpassword123");
    console.log(`Password valid: ${isPasswordValid}`);

    // Get public profile
    console.log("\n👤 Public Profile (sensitive data removed):");
    const publicProfile = savedUser.getPublicProfile();
    console.log("Email included:", !!publicProfile.email);
    console.log("Password included:", !!publicProfile.password);

    mongoose.disconnect();
    console.log("\n✅ Test completed successfully!");
  } catch (error) {
    console.error("❌ Error:", error.message);
    mongoose.disconnect();
  }
}

// Run the test
createTestUser();
