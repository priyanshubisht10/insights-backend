const express = require("express");
const passport = require("passport");

const router = express.Router();

router
  .route("/google")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));

router.route("/google/callback").get(
  passport.authenticate("google", {
    successRedirect: `${process.env.SERVER_URL}/auth/login/success`,
    failureRedirect: `${process.env.SERVER_URL}/auth/login/failed`,
  })
);

router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      error: false,
      message: "Successfully logged in!",
      user: req.user,
    });
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    error: true,
    message: "Login failure",
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(`${process.env.SERVER_URL}/auth/login/success`);
});

module.exports = router;
