const express = require("express");
const CheckEmailController = require("../controller/CheckEmail");
const RegisterUserController = require("../controller/Register");
const CheckPasswordController = require("../controller/Checkpassword");
const userDetailsController = require("../controller/USerdetails");
const LogoutController = require("../controller/logout");
const updateUserdetailscontroller = require("../controller/Updateuserdetails");
const SearchUSerController = require("../controller/SearchUser");

const router = express.Router();

router.post("/register", RegisterUserController);
router.post("/check-email", CheckEmailController);
router.post("/password", CheckPasswordController);
router.get("/getuser", userDetailsController);
router.get("/logout", LogoutController);
router.post("/update", updateUserdetailscontroller);
router.post("/search-user", SearchUSerController);

module.exports = router;
