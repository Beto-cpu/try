const mongoose = require("mongoose");
const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

const categorySchema = Schema({
  name: { type: String, default: null },
});

let Category = mongoose.model("Category", categorySchema, "categories");

//GET - Return Return a Category with specified ID
exports.findCategoryByID = function (req, res) {
  Category.findById(req.params.id, function (err, categories) {
    if (err) return res.send(500, err.message);

    console.log("GET /categories/" + req.params.id);
    res.status(200).jsonp(categories);
  });
};

//GET - Return Return a Category with a similar Name
exports.findCategories = function (req, res) {
  Category.find(req.params, function (err, categories) {
    if (err) return res.send(500, err.message);

    console.log("GET /categories/" + req.params.name);
    res.status(200).jsonp(categories);
  });
};

//POST - Insert a new Category in the DB
exports.addCategory = function (req, res) {
  console.log("POST");
  console.log(req.body);

  var category = new Category({
    name: req.body.name,
  });
  category.save(function (err, cat) {
    if (err) return res.status(500).send(err.message);
    res.status(200).jsonp(cat);
  });
};

//PUT - Update a register already exists
exports.updateCategory = function (req, res) {
  Category.findById(req.params.id, function (err, category) {
    category.name = req.body.name;
    
    category.save(function (err) {
      if (err) return res.status(500).send(err.message);
      res.status(200).jsonp(category);
    });
  });
};

//DELETE - Delete a Category with specified ID
exports.deleteCategory = function (req, res) {
  Category.findById(req.params.id, function (err, category) {
    category.remove(function (err) {
      if (err) return res.status(500).send(err.message);
      res.status(200).send();
    });
  });
};
