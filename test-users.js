require("dotenv").config({ path: "./backend/.env" });
const mongoose = require("mongoose");
const User = require("./backend/models/User");

console.log("MongoDB URI:", process.env.MONGODB_URI);

async function testUsersAndCreate() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Count users
    const userCount = await User.countDocuments();
    console.log(`📊 Total users in database: ${userCount}`);

    // Get all users
    const users = await User.find().select(
      "username displayName email followers following"
    );
    console.log(`\n👥 Users in database:`);
    users.forEach((user, index) => {
      console.log(
        `${index + 1}. ${user.username} (${user.displayName}) - Email: ${
          user.email
        }`
      );
      console.log(
        `   Followers: ${user.followers.length}, Following: ${user.following.length}`
      );
    });

    // Create a test user if none exist
    if (userCount === 0) {
      console.log("\n🔧 No users found, creating test user...");
      const testUser = new User({
        username: "testuser",
        displayName: "Test User",
        email: "test@example.com",
        password: "hashedpassword123", // This would normally be hashed
        followers: [],
        following: [],
      });
      await testUser.save();
      console.log("✅ Test user created!");
    }

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error:", error);
    mongoose.connection.close();
  }
}

testUsersAndCreate();
