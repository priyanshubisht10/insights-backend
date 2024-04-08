const express = require("express");
const videoController = require("../controllers/videoController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router.route("/").get(videoController.getVideos);

router.route("/runScan/").post(videoController.runScan); //videoId must be passed in the req body

module.exports = router;
