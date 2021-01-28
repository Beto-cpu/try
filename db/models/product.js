const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;
ObjectId = Types.ObjectId;

const productSchema = Schema({
  categoryID: {type: ObjectId },
  name: {type: String, default: null },
  description: {type: String, default: null },
  price: {type: Number, default: null },
  image: { data: Buffer, contentType: String},
});

let Product = model('Product', productSchema, 'products');
exports.Product = Product;

//GET - Return Return a Product with specified ID
exports.findProductByID = function (req, res) {
  Product.findById(req.params.id, function (err, products) {
    if (err) return res.send(500, err.message);

    console.log("GET /products/" + req.params.id);
    res.status(200).jsonp(products);
  });
};

//GET - Return Return a Product with a similar Name
exports.findProducts = function (req, res) {
  Product.find(req.query, function (err, products) {
    if (err) return res.send(500, err.message);

    console.log("GET /products?");
    console.log(req.query);
    res.status(200).jsonp(products);
  });
};

//POST - Insert a new Product in the DB
exports.addProduct = function (req, res) {
  console.log("POST");
  console.log(req.body);

  var product = new Product({
    name: req.body.name,
    price: req.body.price*100,
    description: req.body.description,
  });
  product.save(function (err, prd) {
    if (err) return res.status(500).send(err.message);
    res.status(200).jsonp(prd);
  });
};

//PUT - Update a register already exists
exports.updateProduct = function (req, res) {
  Product.findById(req.params.id, function (err, product) {
    product.name = req.body.name;
    product.price = req.body.price*100;
    product.description = req.body.description;
    
    product.save(function (error) {
      if (error) return res.status(500).send(error.message);
      res.status(200).jsonp(product);
    });
  });
};

//DELETE - Delete a Product with specified ID
exports.deleteProduct = function (req, res) {
  Product.findById(req.params.id, function (err, product) {
    product.remove(function (error) {
      if (error) return res.status(500).send(error.message);
      res.status(200).send();
    });
  });
};