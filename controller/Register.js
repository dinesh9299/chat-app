const UserModel = require("../models/UserModel");
const bcryptjs = require("bcryptjs");

async function RegisterUserController(req, res) {
  try {
    const { name, email, password, profile_pic } = req.body;

    const checkUser = await UserModel.findOne({ email });

    if (checkUser) {
      return res.status(201).json({
        message: "User already exists",
        error: true,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const user = new UserModel({
      name,
      email,
      profile_pic,
      password: hashedPassword,
    });

    const userSaved = await user.save();

    return res.status(200).json({
      message: "User created successfully",
      data: userSaved,
      success: true,
    });
  } catch (error) {
    console.log("Error in RegisterUserController:", error);
    return res.status(500).json({
      message: "Server error",
      error: true,
    });
  }
}

module.exports = RegisterUserController;
