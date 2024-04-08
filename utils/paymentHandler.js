const Payment = require("../models/paymentModel");
const Session = require("../models/sessionModel");
const Comment = require("../models/commentModel");
const AppError = require("./appError");

async function handleSuccessfulPayment(event) {
  //logging conditions
  // console.log(
  //   event.type == "checkout.session.completed",
  //   event.data.object.payment_status === "paid",
  //   event.data.object.status == "complete"
  // );

  if (
    event.type === "checkout.session.completed" &&
    event.data.object.payment_status === "paid" &&
    event.data.object.status === "complete"
  ) {
    try {
      console.log("ENTERED handleSuccessfulPayment util");
      const sessionID = event.data.object.id;
      const session = await Session.findOne({ sessionId: sessionID });

      if (session) {
        const paymentBody = {
          user: session.user,
          sessionId: sessionID,
          metadata: event,
        };
        const payment = await Payment.create(paymentBody);
        // console.log("Payment created:", payment);

        //set all the current comments to the field
        await Comment.updateMany({}, { $set: { billed: true } });

        return payment;
      } else {
        console.log("Session not found for session ID:", sessionID);
      }
    } catch (error) {
      console.log("Error in payment processing:", error);
    }
  }
}

module.exports = handleSuccessfulPayment;
