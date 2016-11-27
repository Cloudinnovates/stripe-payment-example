var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export function handlePayment(req, res, next) {
  console.log("Starting payment");
// Get the credit card details submitted by the form
  const token = req.body.token; // Using Express
  console.log(token);
// Create a charge: this will charge the user's card
  stripe.charges.create({
    amount: 1000, // Amount in cents
    currency: "eur",
    source: token,
    description: "Example charge"
  }, function(err, charge) {
    console.log("Payment done");
    if (err) {
      console.log(err);
      return;
    }

    res.send(charge);
    res.end();
  });
}