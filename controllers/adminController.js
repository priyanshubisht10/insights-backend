const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  let filter = {};
  const features = new APIFeatures(User.find(filter), req.query) //creating a new APIfeatures object
    .filter()
    .sort()
    .paginate();

  let doc = await features.query;

  res.status(200).json({
    status: "success",
    results: doc.length,
    data: {
      doc,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
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

exports.deleteUser = catchAsync(async (req, res, next) => {
  const doc = await User.findByIdAndUpdate(
    req.params.userId,
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
    data: doc,
  });
});
