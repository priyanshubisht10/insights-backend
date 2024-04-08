const Comment = require("../models/commentModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const fetchComments = require("../utils/fetchComments");
const { google } = require("googleapis");

exports.getComments = catchAsync(async (req, res, next) => {
  const comments = await fetchComments(req.params.videoId);
  if (!comments) {
    return next(new AppError("Could not fetch comments", 400));
  }

  res.status(200).json({
    status: "success",
    comments,
  });
});

exports.canReply = catchAsync(async (req, res, next) => {
  const comments = await Comment.find({
    user: req.user.id,
    reply: true,
    videoId: req.params.videoId,
  });

  if (!comments) {
    return next(new AppError("Could not fetch comments", 400));
  }

  res.status(200).json({
    status: "success",
    results: comments.length,
    comments,
  });
});

//read youtube api docs
exports.reply = catchAsync(async (req, res, next) => {
  /**
   * To use OAuth2 authentication, we need access to a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI
   * from the client_secret.json file. To get these credentials for your application, visit
   * https://console.cloud.google.com/apis/credentials.
   */
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:8000/api/v1/users/auth/google/callback"
  );

  // Access scopes for read-only Drive activity.
  const scopes = ["https://www.googleapis.com/auth/drive.metadata.readonly"];

  // Generate a url that asks permissions for the Drive activity scope
  const authorizationUrl = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: "offline",
    /** Pass in the scopes array defined above.
     * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
    scope: scopes,
    // Enable incremental authorization. Recommended as a best practice.
    include_granted_scopes: true,
  });

  res.status(200).json({
    authorizationUrl,
  });
});
