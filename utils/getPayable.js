const Comment = require("../models/commentModel");
const mongoose = require("mongoose");
const AppError = require("./appError");

//not returning 0 when the result is null
async function getPayable(userId) {
  const result = await Comment.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        billed: false,
      },
    },
    {
      $count: "commentsCount",
    },
  ]);

  if (!result) {
    return next(
      new AppError("Error fetching due amount! Pipeline failed", 400)
    );
  }
  console.log(result, typeof result);

  // if (result[0] === undefined) {
  //   return 0;
  // }

  return result[0].commentsCount * 70;
}

module.exports = getPayable;
