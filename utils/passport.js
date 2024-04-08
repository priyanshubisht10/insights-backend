const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8000/api/v1/users/auth/google/callback", //users is added beacause this route is available on user endpoint
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(accessToken);
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("serializing user.");
  callback(null, user);
});

passport.deserializeUser((id, done) => {
  console.log("deserialize user.");
  callback(null, user);
});
