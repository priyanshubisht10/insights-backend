const Comment = require("../models/commentModel");

//scale it (add args for params and Model as per requirements)
async function scanCheck(commentid) {
  try {
    const existingComment = await Comment.findOne({
      commentId: commentid,
    });
    console.log(existingComment);
    if (existingComment) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = scanCheck;
