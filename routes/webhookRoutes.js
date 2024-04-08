const express = require("express");
const webhookController = require("../controllers/webhookController");

const router = express.Router();

router.route("/stripe").post(webhookController.stripe);

module.exports = router;
