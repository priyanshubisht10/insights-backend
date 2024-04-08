const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const getPayable = require("../utils/getPayable");
const Session = require("../models/sessionModel");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

/*
1. use Stripe Webhooks to store the payment data in MongoDB based on payment status (done)
*/

exports.makePayment = catchAsync(async (req, res, next) => {
  const product = await stripe.products.create({
    name: "Insights Premium",
    description:
      "Insights is an analysis platform which provides content creators to get insights from the user generated feedbacks on their videos",
  });

  const price = await stripe.prices.create({
    unit_amount: await getPayable(req.user.id),
    currency: "usd",
    product: product.id,
  });

  //created a new session (refer strpe documentation)
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price: price.id,
        quantity: 1,
      },
    ],
    success_url: `${process.env.SERVER_URL}/success.html`,
    cancel_url: `${process.env.SERVER_URL}/cancel.html`,
  });

  if (!session) {
    return next(new AppError("Some error occurred!", 500));
  }

  // console.log(session);   //will be required to get information regarding the session (id, etc)

  //storing payment sessions in the database
  const sessionData = await Session.create({
    user: req.user.id,
    sessionId: session.id,
  });

  //sending the session url in the response object
  res.status(200).json({
    status: "success",
    url: session.url,
    data: sessionData,
  });
});
