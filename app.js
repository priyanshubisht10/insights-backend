const express = require("express");
const morgan = require("morgan");
const path = require("path");
const userRouter = require("./routes/userRoutes");
const videoRouter = require("./routes/videoRoutes");
const adminRouter = require("./routes/adminRoutes");
const commentRouter = require("./routes/commentRoutes");
const paymentRouter = require("./routes/paymentRoutes");
const webhookRouter = require("./routes/webhookRoutes");
const AppError = require("./utils/appError");
const bodyparser = require("body-parser");
const session = require('express-session');
const passport = require("passport");

const app = express();

app.use(
  "/api/v1/webhooks/",
  bodyparser.raw({ type: "application/json" }),
  webhookRouter
);

app.use(express.json()); //parse the payload
app.use(express.urlencoded({ extended: true })); // parse URL-encoded payloads with extended mode

app.use(
  session({
    secret: process.env.OAUTH_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Disable automatic parsing
// app.use(bodyparser.raw({ verify: (req, res, buf) => { req.rawBody = buf; } }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  console.log("Middleware hit");
  // console.log(req.headers);
  // console.log("Request body:", req.body);
  next();
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/comments/", commentRouter);
app.use("/api/v1/payments/", paymentRouter);
// app.use(
//   "/api/v1/webhooks/",
//   bodyparser.raw({ type: "application/json" }),
//   webhookRouter
// ); //router moved above app.use(express.json())

app.all("*", (req, res, next) => {
  next(new AppError(`Could not find ${req.originalUrl} on this Server!`, 404));
});

module.exports = app;
