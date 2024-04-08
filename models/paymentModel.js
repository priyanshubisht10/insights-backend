const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Payment must belong to some account"],
  },
  sessionId: {
    type: String,
    required: [true, "Payment must belong to some session"],
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
});

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
