const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: [20, "User's name length cannot exceed 20 letters!"],
    minlength: [2, "User's name length should be atleast 2 letters!"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please fill a valid email address"],
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Password must be 8 characters long!"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  channelId: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  bill: {
    type: Number,
    default: 0,
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
  active: {
    default: true,
    type: Boolean,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  //return early if the password is not modified
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12); //encrypting the password
  this.passwordConfirm = undefined;

  next();
});

userSchema.pre("save", function (next) {
  //return early if the password is not modified or the doc is newly created
  if (!this.isModified("password") || this.isNew) {
    return next();
  }

  this.passwordChangedAt = Date.now() - 1000; //adding the password changed at field while signing up a new user
  next();
});

//routes available only for active users
userSchema.pre(/^find/, function (next) {

  //failing
  if (this.role === "admin") {
    console.log("hit");
    return next();
  }

  //working
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (current, candidate) {
  return await bcrypt.compare(current, candidate); //comparing encrypted password and normal password
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
