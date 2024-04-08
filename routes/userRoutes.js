const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const passport = require("passport");

const router = express.Router();

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);

// router.use(authController.protect);
//below routes are only for authentiacated users

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: `${process.env.SERVER_URL}/success.html`,
    failureRedirect: `${process.env.SERVER_URL}/cancel.html`,
  }),
  (req, res) => {
    // Successful authentication, redirect or handle the user as desired
    console.log("/auth/google/callback hit");
    res.redirect(`${process.env.SERVER_URL}/success.html`);
  }
);
// Logout route
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.route("/me").get(userController.getMe);
router.route("/updateprofile").patch(userController.updateMe);

router.route("/updatepassword").patch(authController.updatePassword);
// router.route("/videos").get(userController.getVideos);

router.route("/connect").patch(userController.connectYoutubeAccount); //id=>userId

router.route("/delete").delete(userController.deleteMe); //set active: false and made changes in the user model

router.route("/bill").get(userController.getAllTimeBill); //retrieve all time usage of the account

router.route("/due").get(userController.getDueAmount); //retrive the due amount of the user

router.route("/auth/google").get(authController.oauth2Google);
router.route("/auth/google/callback").get(authController.oauth2GoogleCallback);

module.exports = router;
