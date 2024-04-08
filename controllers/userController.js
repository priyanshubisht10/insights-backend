const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const Comment = require("../models/commentModel");
const mongoose = require("mongoose");
const getPayable = require("../utils/getPayable");

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new AppError("Could not fetch account details!", 404));
  }

  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.connectYoutubeAccount = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError("User does not exist!", 404));
  }

  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  //retruning early is the payload has role or bill in it
  if ("bill" in req.body || "role" in req.body) {
    return next(new AppError("Updating bill or role is not allowed!", 400));
  }

  const { bill, role, ...newbody } = req.body; //redundant check but feels necessary

  const user = await User.findByIdAndUpdate(req.user.id, newbody, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError("User does not exist!", 404));
  }

  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("bill");
  if (user.bill > 0) {
    return next(
      new AppError("The bills are still due! Cannot delete account", 404)
    );
  }

  const doc = await User.findByIdAndUpdate(
    req.user.id,
    { active: false },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!doc) {
    return next(new AppError("Could not delete account!", 404));
  }

  res.status(200).json({
    status: "success",
    data: null,
  });
});

exports.getAllTimeBill = catchAsync(async (req, res, next) => {
  const result = await Comment.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(req.user.id),
      },
    },
    {
      $count: "commentsCount",
    },
  ]);

  if (!result) {
    return next(
      new AppError("Could not fetch the bill! Please try again later.", 401)
    );
  }
  console.log(result);
  const totalBill = result[0].commentsCount * 0.7;

  res.status(200).json({
    status: "success",
    totalBill,
  });
});

exports.getDueAmount = catchAsync(async (req, res, next) => {
  const result = await getPayable(req.user.id);

  if (result === null) {
    return next(
      new AppError("Could not fetch the bill! Please try again later.", 401)
    );
  }

  // const dueAmount = result[0].commentsCount * 0.7;

  res.status(200).json({
    status: "success",
    dueAmount: result,
  });
});
