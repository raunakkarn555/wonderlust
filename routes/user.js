const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");


// signup
router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signUp));

// login
router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userController.login );

// logout
router.get("/logout", userController.logout);


// pages
router.get("/about", userController.renderAbout);
router.get("/contact", userController.renderContact);
router.post("/contact", wrapAsync(userController.submitContactForm));
router.get("/privacy", userController.renderPrivacy);
router.get("/terms", userController.renderTerms);
router.get("/developer", userController.renderDeveloper);

module.exports = router;