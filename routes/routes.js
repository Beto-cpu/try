const express = require("express");
const router = express.Router();
var ObjectId = require("mongodb").ObjectID;
const stripe = require("stripe")(
  "sk_test_51IBscADopkXLPa8T5OoCQiQliH1UvuvutLmwXWwQotRCZPxvSBoOydxkvwYBb6suhBXlWIKYK3tKZReoR0vIL2I800eICS4yvX"
);
const mongoUtil = require("../db");

router.get("/", (req, res) => {
  res.render("pages/payment");
});
router.get("/cancel", (req, res) => {
  res.render("pages/cancel");
});
router.get("/success", (req, res) => {
  res.render("pages/success");
});

var YOUR_DOMAIN = "http://localhost:3000";

const get = (items) => {
  return 1400;
};

router.post("/create-checkout", async (req, res) => {
  let id = req.body.id;
  let quantity = 1;
  let data = await mongoUtil.getProductByID(id);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: data.name,
            images: [
              "https://cdn3.volusion.com/9nxdj.fchy5/v/vspfiles/photos/DG-332-2.jpg?v-cache=1602075128",
            ],
          },
          unit_amount: data.price,
        },
        quantity,
      },
    ],
    mode: "payment",
    success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${YOUR_DOMAIN}/cancel?session_id={CHECKOUT_SESSION_ID}`,
  });

  mongoUtil.registerTransaction({
    transactionID: session.id,
    productId: id,
    customer: session.customer,
    payment_status: session.payment_status,
    date: new Date(),
    amount_total: session.amount_total,
  });

  res.json({ id: session.id });
});

router.post("/update-checkout",  async (req, res) => {
  mongoUtil.updateTransaction(req.body.transactionID);
  res.send('Updated');
});

// exportamos a app.js
module.exports = router;
