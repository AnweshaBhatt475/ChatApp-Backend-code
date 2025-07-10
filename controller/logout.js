// controllers/logout.js

async function logout(request, response) {
  try {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // works for localhost/dev
      sameSite: 'lax',
      maxAge: 0, // Expire the cookie immediately
    };

    return response
      .cookie('token', '', cookieOptions)
      .status(200)
      .json({
        message: 'Session out',
        success: true,
      });

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

module.exports = logout;
