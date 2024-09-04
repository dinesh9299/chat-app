const UserModel = require("../models/UserModel");

async function CheckEmailController(req, res) {
  const { email } = req.body;

  try {
    const checkemail = await UserModel.findOne({ email });

    if (!checkemail) {
      return res.status(201).json({
        message: "invalid email address",
        error: false,
      });
    }

    return res.status(201).json({
      message: "email verified",
      data: checkemail,
      success: true,
    });
  } catch (error) {
    console.log("error", error);
  }
}

module.exports = CheckEmailController;
