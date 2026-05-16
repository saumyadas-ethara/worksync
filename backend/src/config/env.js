require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 5000,
  // Railway MongoDB plugin injects MONGO_URL; Atlas uses MONGODB_URI
  MONGODB_URI: process.env.MONGODB_URI || process.env.MONGO_URL || process.env.MONGODB_URL || null,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  NODE_ENV: process.env.NODE_ENV || "development",
};

