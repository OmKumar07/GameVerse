const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const gameRoutes = require("./routes/games");
const listRoutes = require("./routes/lists");
const publicRoutes = require("./routes/public");

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// CORS configuration (must be before rate limiting)
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5176",
  "http://localhost:5173",
  "http://localhost:5177", // Add the new port
  "https://game-verse7.netlify.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Origin",
      "X-Requested-With",
      "Accept",
    ],
    optionsSuccessStatus: 200, // Some legacy browsers choke on 204
  })
);

// Rate limiting (after CORS)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs (increased for development)
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/gameverse", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/public", publicRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  // Check MongoDB connection status without making queries
  const dbStatus = mongoose.connection.readyState;
  const dbStatusText = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  res.status(200).json({
    status: "OK",
    message: "GameVerse API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    uptime: process.uptime(),
    database: {
      status: dbStatusText[dbStatus] || "unknown",
      connected: dbStatus === 1,
    },
  });
});

// Keep-alive endpoint (for external ping services)
app.get("/api/keep-alive", (req, res) => {
  res.status(200).json({
    status: "alive",
    timestamp: new Date().toISOString(),
    message: "Server is awake",
  });
});

// Self-ping mechanism to prevent server from sleeping
const keepServerAlive = () => {
  const serverUrl = process.env.SERVER_URL || `http://localhost:${PORT}`;

  // Only run in production to avoid unnecessary requests in development
  if (process.env.NODE_ENV === "production" && process.env.SERVER_URL) {
    setInterval(async () => {
      try {
        const https = require("https");
        const http = require("http");
        const url = require("url");

        const parsedUrl = url.parse(`${serverUrl}/api/keep-alive`);
        const options = {
          hostname: parsedUrl.hostname,
          port: parsedUrl.port,
          path: parsedUrl.path,
          method: "GET",
          timeout: 5000,
        };

        const protocol = parsedUrl.protocol === "https:" ? https : http;

        const req = protocol.request(options, (res) => {
          console.log(`🏓 Keep-alive ping successful: ${res.statusCode}`);
        });

        req.on("error", (err) => {
          console.log(`🔴 Keep-alive ping failed: ${err.message}`);
        });

        req.on("timeout", () => {
          console.log("🔴 Keep-alive ping timeout");
          req.destroy();
        });

        req.end();
      } catch (error) {
        console.log(`🔴 Keep-alive error: ${error.message}`);
      }
    }, 30 * 60 * 1000); // Ping every 30 minutes (most services sleep after 30-60 minutes)

    console.log("🏓 Keep-alive mechanism started - pinging every 30 minutes");
  }
};

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Validation Error",
      message: err.message,
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: "Invalid Token",
      message: "Authentication failed",
    });
  }

  res.status(500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong"
        : err.message,
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: "The requested endpoint does not exist",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 GameVerse API server running on port ${PORT}`);
  console.log(
    `📱 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`
  );
  console.log(`🔗 API URL: http://localhost:${PORT}/api`);

  // Start keep-alive mechanism
  keepServerAlive();
});

module.exports = app;
