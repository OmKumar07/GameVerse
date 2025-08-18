const mongoose = require("mongoose");
const User = require("./models/User");

// Connect to MongoDB
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/gameverse",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

async function testDatabase() {
  try {
    console.log("Testing database connection...");

    // Count total users
    const userCount = await User.countDocuments();
    console.log(`Total users in database: ${userCount}`);

    // Get first few users
    const users = await User.find()
      .limit(3)
      .select("username displayName followers following");
    console.log("Sample users:");
    users.forEach((user) => {
      console.log(
        `- ${user.username} (${user.displayName}): ${user.followers.length} followers, ${user.following.length} following`
      );
    });

    mongoose.connection.close();
  } catch (error) {
    console.error("Database test error:", error);
    mongoose.connection.close();
  }
}

testDatabase();
