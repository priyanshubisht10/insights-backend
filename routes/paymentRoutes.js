const express = require("express");
const authController = require("../controllers/authController");
const paymentController = require("../controllers/paymentController");

const router = express.Router();

router.use(authController.protect);

router.route("/pay").post(paymentController.makePayment);

module.exports = router;
