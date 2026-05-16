const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();
const isProd = process.env.NODE_ENV === "production";

// Middleware
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173,http://localhost:3000")
  .split(",")
  .map(o => o.trim());

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is running", env: process.env.NODE_ENV });
});

// API Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/projects", require("./routes/project.routes"));
app.use("/api/tasks", require("./routes/task.routes"));
app.use("/api/dashboard", require("./routes/dashboard.routes"));

// Serve built React frontend in production
if (isProd) {
  const frontendDist = path.join(__dirname, "../../frontend/dist");
  app.use(express.static(frontendDist));
  // SPA fallback — all non-API routes serve index.html
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
} else {
  // 404 handler for dev
  app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
  });
}

// Global error handler
app.use(errorMiddleware);

module.exports = app;

