const { request } = require("express");
const getuserDetailsfromtoken = require("../helpers/getuserdetailsfromtoken");

async function userDetailsController(req, res) {
  try {
    const token = req.cookies.token || "";

    

    const user = await getuserDetailsfromtoken(token);

    return res.status(200).json({
      message: "user details",
      data: user,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

module.exports = userDetailsController;
