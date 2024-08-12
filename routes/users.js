const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const { storeReturnTo } = require("../middleware");
const {
  renderRegisterForm,
  createUser,
  renderLoginForm,
  login,
  logout,
} = require("../controllers/user");

router.route("/register").get(renderRegisterForm).post(catchAsync(createUser));

router
  .route("/login")
  .get(renderLoginForm)
  .post(
    storeReturnTo,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    login
  );

router.get("/logout", logout);

module.exports = router;
