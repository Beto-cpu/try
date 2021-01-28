const { Schema, model, Types } = require("mongoose");
const Product = require('./product').Product;
const stripe = require("stripe")(
  "sk_test_51IERlKAewgYYy1mgucIdr9MiK9YfGxugc1wop8Rrj2Ux6Wqog4wQrsFHEZOM6VSGvJUyf5E3G50xLCYxHpTDmCR000ChgAOgvo"
);

const transactionSchema = Schema({
  _id: {type: String},
  customer_details: { type: String },
  payment_status: { type: String },
  date: { type: Date, default: new Date() },
  amount_total: { type: Number },
});

let Transaction = model("Transaction", transactionSchema, "transactions");



//GET - Return Return a Transaction with specified ID
exports.findTransactionByID = function (req, res) {  
  Transaction.findById(req.params.id, function (err, transactions) {
    if (err) return res.send(500, err.message);

    console.log("GET /transactions/" + req.params.id);
    res.status(200).jsonp(transactions);
  });
};

//GET - Return all transaction in the DB
exports.findTransactions = function (req, res) {
  Transaction.find(req.query, function (err, transactions) {
    if (err) res.send(500, err.message);

    console.log("GET /transactions?");
    console.log(req.query);
    res.status(200).jsonp(transactions);
  });
};

//POST - Insert a new Transaction in the DB
exports.createCheckoutSession = function (req, res) {
  console.log("POST");
  console.log(req.body);  

  Product.findById(req.body.id, async function (err, product) {
    if (err) res.send(500, err.message);
    if (product == null) res.status(500).send('None item with provided id.');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              images: [
                "https://cdn3.volusion.com/9nxdj.fchy5/v/vspfiles/photos/DG-332-2.jpg?v-cache=1602075128",
              ],
            },
            unit_amount: product.price,
          },
          quantity: req.body.quantity,
        },
      ],
      mode: "payment",
      success_url: `${req.get('host')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.get('host')}/cancel?session_id={CHECKOUT_SESSION_ID}`,
    });
  
    res.json({ id: session.id });
  });
};

//Stripe Webhook 
const endpointSecret = 'whsec_...';
exports.webhook = async (request, response) => {
  var data = request.body.data.object;
  data._id = data.id;
  const sig = request.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  }
  catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  switch (event.type) {
    case 'checkout.session.async_payment_succeeded':
    case 'checkout.session.async_payment_failed':
    case 'checkout.session.async_payment_failed':
      Transaction.findOneAndUpdate({_id: data.id}, data, {upsert: true}, function(err, doc) {
        if (err) console.log(err.message);
        else{
          console.log('Transaction Upsert');
          console.log(prd);
        }
      });
      break;
    default:
      console.log(`Unhandled event type ${event.type}.`);
  }
  
  response.status(200);
};