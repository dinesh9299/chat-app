const UserModel = require("../models/UserModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY; // Ensure this is set in your .env file

async function CheckPasswordController(req, res) {
  const { password, userid } = req.body;

  try {
    // Find user by userid (ensure field name matches your schema, e.g., _id)
    const user = await UserModel.findOne({ _id: userid });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
      });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid password",
        error: true,
      });
    }

    const tokendata = {
      id: user._id,
      email: user.email,
    };

    const token = jwt.sign(
      tokendata,
      process.env.JWT_SECRET_KEY
      //   , {
      //   expiresIn: "2m", // Set token expiration as needed
      // }
    );

    const cookieOptions = {
      httpOnly: true, // Secure if using HTTPS
      secure: process.env.NODE_ENV === "production", // Set secure flag based on environment
      sameSite: "None", // Improve security by restricting cookie to same-site requests
    };

    return res.status(200).cookie("token", token, cookieOptions).json({
      message: "Login successful",
      token: token,
      success: true,
    });
  } catch (error) {
    console.log("Error in CheckPasswordController:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: true,
    });
  }
}

module.exports = CheckPasswordController;
