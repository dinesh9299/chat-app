const getuserDetailsfromtoken = require("../helpers/getuserdetailsfromtoken");
const UserModel = require("../models/UserModel");

async function updateUserdetailscontroller(req, res) {
  try {
    const token = req.cookies.token || "";

    const user = await getuserDetailsfromtoken(token);

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized: Invalid token",
        success: false,
      });
    }

    const { name, profile_pic } = req.body;

    // Update the user details
    await UserModel.updateOne(
      { _id: user._id },
      {
        name,
        profile_pic,
      }
    );

    // Fetch the updated user details
    const userInformation = await UserModel.findById(user._id);

    return res.json({
      message: "User updated successfully",
      data: userInformation,
      success: true,
    });
  } catch (error) {
    console.error("Error updating user details:", error.message);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
    });
  }
}

module.exports = updateUserdetailscontroller;
