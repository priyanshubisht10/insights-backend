const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, "Comment must have some content."],
  },
  // video: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: "Video",
  //   required: [true, "Comment must belong to some video"],
  // },
  videoId: {
    type: String,
    required: [true, "Comment must belong to some video"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Comment must belong to some user"],
  },
  commentId: {
    type: String,
    unique: true,
  },
  emotion: {
    type: String,
    enum: [
      "positive",
      "affection",
      "curiosity",
      "negativity",
      "social",
      "reflective",
      "recognition",
      "relief",
      "mixed",
      "na",
    ],
    default: "na",
  },
  reply: {
    type: Boolean,
    default: false,
  },
  replied: {
    type: Boolean,
    default: false,
  },
  billed: {
    type: Boolean,
    default: false,
  },
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
