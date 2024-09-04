async function LogoutController(req, res) {
  try {
    const cookieOptions = {
      httpOnly: true, // Secure if using HTTPS
      secure: true, // Set secure flag based on environment
    };

    return res.cookie("token", "", cookieOptions).json({
      message: "sessios out",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

module.exports = LogoutController;
