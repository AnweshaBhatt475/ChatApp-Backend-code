const UserModel = require("../models/UserModel");

async function updateWallpaper(request, response) {
  try {
    const { wallpaperUrl } = request.body;
    const userId = request.user?.id || request.body.userId;

    if (!userId) {
      return response.status(401).json({ message: "Unauthorized", error: true });
    }

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { wallpaper: wallpaperUrl },
      { new: true }
    ).select("-password");

    return response.status(200).json({
      message: "Wallpaper updated",
      data: user,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Server error",
      error: true,
    });
  }
}

module.exports = updateWallpaper;