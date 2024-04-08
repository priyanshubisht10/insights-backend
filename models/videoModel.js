const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Video must have a title."],
  },
  commentsCount: {
    type: Number,
    default: 0,
  },
  lastScannedDate: {
    type: Date,
  },
  videoId: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    unique: true,
    ref: "User",
    required: [true, "Video must belong to some channel"],
  },
  emotionsList: {
    type: [Number],
    default: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
});

const Video = mongoose.model("Video", videoSchema);
module.exports = Video;
