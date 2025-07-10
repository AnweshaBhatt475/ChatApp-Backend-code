const UserModel = require("../models/UserModel");
const bcryptjs = require("bcryptjs");

async function registerUser(request, response) {
  try {
    const { name, email, password, profile_pic } = request.body;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return response.status(400).json({
        message: "User already exists",
        error: true,
      });
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new UserModel({
      name,
      email,
      profile_pic,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    return response.status(201).json({
      message: "User created successfully",
      data: savedUser,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Internal server error",
      error: true,
    });
  }
}

module.exports = registerUser;
