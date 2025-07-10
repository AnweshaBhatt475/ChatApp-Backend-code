const UserModel = require('../models/UserModel');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function checkPassword(request, response) {
  try {
    const { password, userId } = request.body;

    // 1️⃣  Find user by id
    const user = await UserModel.findById(userId);
    if (!user) {
      return response.status(400).json({
        message: 'User not found',
        error: true,
      });
    }

    // 2️⃣  Verify password
    const verifyPassword = await bcryptjs.compare(password, user.password);
    if (!verifyPassword) {
      return response.status(400).json({
        message: 'Please check password',
        error: true,
      });
    }

    // 3️⃣  Sign JWT
    const tokenData = { id: user._id, email: user.email };
    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) {
      throw new Error('JWT_SECRET_KEY is not set in .env');
    }
    const token = jwt.sign(tokenData, secret, { expiresIn: '1d' });

    // 4️⃣  Cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    };

    // ✅ 5️⃣ Send full user data in response
    return response
      .cookie('token', token, cookieOptions)
      .status(200)
      .json({
        message: 'Login successfully',
        token,
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          profile_pic: user.profile_pic, // ✅ include this
        },
      });

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

module.exports = checkPassword;
