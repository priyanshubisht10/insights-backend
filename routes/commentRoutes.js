const express = require("express");
const commentController = require("../controllers/commentController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router.route("/:videoId").get(commentController.getComments);
router.route("/:videoId/repliable/").get(commentController.canReply);

// router.use(authController.oauth2);
router.route("/comment/reply").post(commentController.reply);

module.exports = router;
