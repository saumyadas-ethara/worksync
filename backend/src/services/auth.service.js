const User = require("../models/User.model");
const ApiError = require("../utils/ApiError");
const { generateToken } = require("../utils/generateToken");

const registerUser = async ({ name, email, password, role }) => {
  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "Email already registered");
  }

  // Accept role from request; model enum ensures only ADMIN or MEMBER are valid
  const userData = { name, email, password };
  if (role === "ADMIN" || role === "MEMBER") userData.role = role;

  const user = await User.create(userData);

  // Generate token
  const token = generateToken({ id: user._id, role: user.role });

  return { user, token };
};

const loginUser = async ({ email, password }) => {
  // Find user (explicitly select password since select:false in schema)
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Compare password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Generate token
  const token = generateToken({ id: user._id, role: user.role });

  return { user, token };
};

const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};

module.exports = { registerUser, loginUser, getCurrentUser };
