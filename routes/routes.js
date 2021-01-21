const express = require("express");
const router = express.Router();
const stripe = require("stripe")(
  "sk_test_51IBscADopkXLPa8T5OoCQiQliH1UvuvutLmwXWwQotRCZPxvSBoOydxkvwYBb6suhBXlWIKYK3tKZReoR0vIL2I800eICS4yvX"
);

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
router.post('/create-checkout-front', async (req, res) => {
    let { amount } = req.body;

const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Product',
            images: ['https://cdn3.volusion.com/9nxdj.fchy5/v/vspfiles/photos/DG-332-2.jpg?v-cache=1602075128'],
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/success.html`,
    cancel_url: `${YOUR_DOMAIN}/cancel.html`,
  });
  res.json({ id: session.id });
});

const calculateOrderAmount = items => {
    return 1400;
  };

router.post('/create-checkout-back', async (req, res) => {
    let id = req.body.id;
    let amount = calculateOrderAmount(id);
    console.log(req.body);

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Product',
                images: ['https://cdn3.volusion.com/9nxdj.fchy5/v/vspfiles/photos/DG-332-2.jpg?v-cache=1602075128'],
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${YOUR_DOMAIN}/success.html`,
        cancel_url: `${YOUR_DOMAIN}/cancel.html`,
      });
      res.json({ id: session.id });
    });

// exportamos a app.js
module.exports = router;
