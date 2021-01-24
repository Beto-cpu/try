const express = require("express");
const router = express.Router();
var ObjectId = require("mongodb").ObjectID;
const stripe = require("stripe")(
  "sk_test_51IBscADopkXLPa8T5OoCQiQliH1UvuvutLmwXWwQotRCZPxvSBoOydxkvwYBb6suhBXlWIKYK3tKZReoR0vIL2I800eICS4yvX"
);
const mongoUtil = require("../db");

router.get("/", (req, res) => {
  res.render("pages/payment", {
    head: "../partials/head.ejs",
  });
});
router.get("/product", (req, res) => {
  res.render("pages/product", {
    head: "../partials/head.ejs",
  });
});
router.get("/search", (req, res) => {
  res.render("pages/search", {
    head: "../partials/head.ejs",
  });
});
router.get("/cancel", (req, res) => {
  res.render("pages/cancel");
});
router.get("/success", (req, res) => {
  res.render("pages/success");
});

var YOUR_DOMAIN = "http://localhost:3000";
router.post("/create-checkout", async (req, res) => {
  try {
    let { id, quantity } = req.body;
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
  } catch (err) {
    console.log(err);
    res.json({ error: "Server Error." });
  }
});

router.post("/update-checkout", async (req, res) => {
  try {
    mongoUtil.updateTransaction(req.body.transactionID);
    res.send("Updated");
  } catch (err) {
    console.log(err);
    res.send("Server error.");
  }
});

router.post("/get-product", async (req, res) => {
  try {
    let { productID } = req.body;
    let product = await mongoUtil.getProductByID(productID);
    res.json(product);
  } catch (err) {
    console.log(err);
    res.json({error: "Elemento no encontrado."});
  }
});
router.post("/update-product", async (req, res) => {
  try {
    await mongoUtil.updateProduct(req.body.productID,{
      name: req.body.actualProduct_name,
      price: (req.body.actualProduct_price*100).toFixed(),
      description: req.body.actualProduct_description,
    });
    res.json(req.body);
  } catch (err) {
    console.log(err);
    res.json({error: "Error."});
  }
});
router.post("/remove-product", async (req, res) => {
  try {
    let { productID } = req.body;
    await mongoUtil.removeProduct(productID);
    res.json(req.body);
  } catch (err) {
    console.log(err);
    res.json({error: "Elemento no encontrado."});
  }
});
router.post("/create-product", async (req, res) => {
  try {
    let product = await mongoUtil.createProduct({
      name: req.body.actualProduct_name,
      price: (req.body.actualProduct_price*100).toFixed(),
      description: req.body.actualProduct_description,
    });
    res.json(product);
  } catch (err) {
    console.log(err);
    res.send("Server error.");
  }
});

// exportamos a app.js
module.exports = router;
