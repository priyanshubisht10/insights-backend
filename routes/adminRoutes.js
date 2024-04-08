const express = require("express");
const authController = require("../controllers/authController");
const adminController = require("../controllers/adminController");
const router = express.Router();

router.use(authController.protect);
router.use(authController.restrictTo("admin"));

router.route("/all").get(adminController.getAllUsers);
router.route("/update/:userId").patch(adminController.updateUser);
router.route('/delete/:userId').patch(adminController.deleteUser);

module.exports = router;
