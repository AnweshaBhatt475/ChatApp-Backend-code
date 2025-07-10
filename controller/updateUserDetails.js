const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");
const UserModel = require("../models/UserModel");

async function updateUserDetails(request, response) {
  try {
    const token = request.cookies.token || "";

    if (!token) {
      return response.status(401).json({
        message: "Authentication token missing",
        error: true,
      });
    }

    const user = await getUserDetailsFromToken(token);

    if (!user || !user._id) {
      return response.status(401).json({
        message: "Invalid or expired token",
        error: true,
      });
    }

    const { name, profile_pic } = request.body;

    if (!name || name.trim() === "") {
      return response.status(400).json({
        message: "Name is required",
        error: true,
      });
    }

    await UserModel.updateOne(
      { _id: user._id },
      {
        name,
        profile_pic,
      }
    );

    const updatedUser = await UserModel.findById(user._id).select("-password");

    return response.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
      success: true,
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message || "Internal server error",
      error: true,
    });
  }
}

module.exports = updateUserDetails;
