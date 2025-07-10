const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

/**
 * Decode JWT token and fetch user info from DB.
 * Returns user object (excluding password) or session info if token is invalid.
 *
 * @param {string} token - JWT token from cookies or headers
 * @returns {Object} user info or logout signal
 */
const getUserDetailsFromToken = async (token) => {
  try {
    if (!token) {
      return {
        message: "Session expired",
        logout: true,
      };
    }

    // ✅ Use correct env variable
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await UserModel.findById(decoded.id).select('-password');

    if (!user) {
      return {
        message: "User not found",
        logout: true,
      };
    }

    return user;

  } catch (error) {
    return {
      message: "Invalid or expired token",
      logout: true,
      error: error.message || error,
    };
  }
};

module.exports = getUserDetailsFromToken;