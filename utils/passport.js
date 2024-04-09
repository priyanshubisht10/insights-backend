const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8000/auth/google/callback", //users is added beacause this route is available on user endpoint
      scope: ["profile", "email"],
    },
    function (accessToken, refreshToken, profile, done) {
      // console.log("profile:");
      console.log(profile);
      console.log(accessToken);
      const user = {
        profile,
        accessToken,
      };
      done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {
  done(null, user);
});
