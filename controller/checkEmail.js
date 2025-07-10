// controllers/checkEmail.js
// ------------------------------------------------------------------
// Validate an email address and return the matching user (minus password)
// ------------------------------------------------------------------

const UserModel = require('../models/UserModel');

async function checkEmail(request, response) {
  try {
    const { email } = request.body;

    // ⬇️ Query user by email, exclude password hash
    const checkEmail = await UserModel.findOne({ email }).select('-password');

    // ⚠️ If user is NOT found, respond with 400
    if (!checkEmail) {
      return response.status(400).json({
        message: 'user not exit',
        error: true,
      });
    }

    // ✅ User found
    return response.status(200).json({
      message: 'email verify',
      success: true,
      data: checkEmail,
    });
  } catch (error) {
    // ❌ Handle unexpected server errors
    return response.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

module.exports = checkEmail;
