const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

const { google } = require("googleapis");
const { OAuth2Client } = require("google-auth-library");
const { OAuth2 } = google.auth;

const { promisify } = require("util");

const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");

// Configure Google OAuth2 strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URL,
      scope: ["email", "profile"],
      passReqToCallback: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(accessToken);
      console.log(profile);
      // Handle OAuth2 authentication logic here if needed
      return done(err, profile);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

// Route handler for OAuth2 authentication
exports.oauth2Google = passport.authenticate("google", {
  scope: ["email", "profile"],
});

// OAuth2 callback route handler
exports.oauth2GoogleCallback = passport.authenticate("google", {
  successRedirect: "/dashboard",
  failureRedirect: "/login", // Redirect to login page if authentication fails
});

// Middleware to handle storing the access token in req.user.accessToken
exports.storeAccessToken = catchAsync(async (req, res, next) => {
  // Access token should already be available in req.user
  const accessToken = req.user.accessToken;
  if (!accessToken) {
    return next(new AppError("Access token not found", 400));
  }

  console.log(accessToken);
  next();
});

const signToken = (id) => {
  //encrypt the the jwt using using the jwt secret
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id); //encrypt the uid using jwt secret

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  //send a response cookie
  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newuser = await User.create(req.body); //creating a new user
  createSendToken(newuser, 201, res); //generate jwt
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    //returning error if either of the email or pswd is empty
    return new AppError("Either password or username is null", 404);
  }

  //fetch the user with the email and the encrypted password
  const user = await User.findOne({ email }).select("+password");

  //comparing the encrypted password with the provided password
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password!"));
  }

  //generate token after login
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    //fetching token from the headers
    token = req.headers.authorization.split(" ")[1]; //fetching the jwt
  }

  //return error if token DNE
  if (!token) {
    return next(new AppError("You are not logged in!", 401));
  }
  // console.log(token);

  //decode the jwt using secret
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //fetching the user document
  const currentUser = await User.findById(decoded.id);

  //return if the current user DNE
  if (!currentUser) {
    return next(
      new AppError("User not found for the corresponding token!", 401) //returning error if no user was found for the id in the decoded JWT
    );
  }

  //ask user to login agian if the jwt has expired because of password change
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("You need to log in again! Password changed recently!", 401)
    );
  }

  //adding the new user to the current user
  req.user = currentUser;
  console.log(req.user.id);
  next();
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //select the user document with password
  const user = await User.findById(req.user.id).select("+password");

  // console.log(user.password, req.body.passwordCurrent);

  //compare the provided password with the prev password
  if (!user.correctPassword(user.password, req.body.passwordCurrent)) {
    return next(new AppError("Passwords did not match!", 401));
  }

  //updating the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  //saving the changes (ref: userSchema)
  await user.save();

  //generate token
  createSendToken(user, 200, res);
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      //block and return error if the user role does not match the provided role
      return next(
        new AppError("You do not have the permission to do this!", 403)
      );
    }
    next();
  };
};
