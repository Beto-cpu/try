const express = require("express");
const router = express.Router();
require("../db/config/db.config");
const mongoUtil = require('../db/models');
var ObjectId = require("mongodb").ObjectID;
const bodyParser = require('body-parser');



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


//Categories
router.route('/categories')
.get(mongoUtil.CategoryCtrl.findCategories)
.post(mongoUtil.CategoryCtrl.addCategory);
router.route('/categories/:id')
.delete(mongoUtil.CategoryCtrl.deleteCategory)
.get(mongoUtil.CategoryCtrl.findCategoryByID)
.put(mongoUtil.CategoryCtrl.updateCategory);

//Products
router.route('/products')
.get(mongoUtil.ProductCtrl.findProducts)
.post(mongoUtil.ProductCtrl.addProduct);
router.route('/products/:id')
.delete(mongoUtil.ProductCtrl.deleteProduct)
.get(mongoUtil.ProductCtrl.findProductByID)
.put(mongoUtil.ProductCtrl.updateProduct);

// Transactions
router.route('/webhook').post(bodyParser.raw({type: 'application/json'}), mongoUtil.TransactionCtrl.webhook)
router.route('/transactions').get(mongoUtil.TransactionCtrl.findTransactions)
router.route('/transactions/:id').get(mongoUtil.TransactionCtrl.findTransactionByID);



//Webhooks


// exportamos a app.js
module.exports = router;
