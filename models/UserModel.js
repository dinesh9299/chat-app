const mongoose = require("mongoose");

const Userschema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Provide name"],
    },
    email: {
      type: String,
      required: [true, "Provide email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Provide password"],
    },
    profile_pic: {
      type: String,
      default: "", // Corrected typo from dafault to default
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("user", Userschema);

module.exports = UserModel;
