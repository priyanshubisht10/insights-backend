const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const paymentHandler = require("../utils/paymentHandler");

exports.stripe = catchAsync(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];
  let event;

  event = stripe.webhooks.constructEvent(
    req.body,
    sig,
    process.env.STRIPE_SIGNING_SECRET
  );

  if (!event) {
    return next(new AppError("Webhook error", 400));
  }

  //make modifications (change code style)
  try {
    let paymentData = await paymentHandler(event);

    // console.log(paymentData); //returning undefined
    // console.log(event.type);
    // console.log(event.data.object);
    // console.log(event.data.object.id);

    res.status(200).json({
      status: "success",
      received: true,
    });
  } catch (error) {
    console.error("Error in payment processing:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});
