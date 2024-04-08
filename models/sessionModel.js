const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Session must be initiated by some account!"],
  },
  sessionId: {
    required: true,
    unique: true,
    type: String,
  },
  status: {
    default: false,
    type: Boolean,
  },
});

const Session = mongoose.model("Session", sessionSchema);
module.exports = Session;
