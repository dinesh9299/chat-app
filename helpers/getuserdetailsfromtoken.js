const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");
const mongoose = require("mongoose"); // Import mongoose for ObjectId validation

const getuserDetailsfromtoken = async (token) => {
  if (!token) {
    console.log("No token provided");
    return {
      message: "Session expired",
      logout: true,
    };
  }

 

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Validate if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
      console.log("Invalid ObjectId:", decoded.id);
      return {
        message: "Invalid user ID",
        logout: true,
      };
    }

    const user = await UserModel.findById(decoded.id).select("-password");

    if (!user) {
      console.log("User not found for ID:", decoded.id);
      return {
        message: "User not found",
        logout: true,
      };
    }

    return user;
  } catch (error) {
    console.error("Error in getuserDetailsfromtoken:", error);

    if (error.name === "TokenExpiredError") {
      return {
        message: "Session expired",
        logout: true,
      };
    }

    return {
      message: "Invalid token",
      logout: true,
    };
  }
};

module.exports = getuserDetailsfromtoken;
