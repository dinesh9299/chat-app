const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");
const mongoose = require("mongoose");

const getuserDetailsfromtoken = async (token) => {
  if (!token) {
    return { message: "Session expired", logout: true };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
      return { message: "Invalid user ID", logout: true };
    }

    const user = await UserModel.findById(decoded.id).select("-password");

    if (!user) {
      return { message: "User not found", logout: true };
    }

    return user;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return { message: "Session expired", logout: true };
    }

    return { message: "Invalid token", logout: true };
  }
};

module.exports = getuserDetailsfromtoken;
