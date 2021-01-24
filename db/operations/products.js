var mongoUtil = require("../config/db.config");
var ObjectId = require("mongodb").ObjectID;

module.exports = {
  getProductByID: async function (id) {
    var db = await mongoUtil.getDb();
    var dbo = await db.db("webstore");

    var myquery = { _id: new ObjectId(id) };

    return new Promise(function (resolve, reject) {
      dbo.collection("products").findOne(myquery, function (err, res) {
        if (err) reject(err);
        resolve(res);
      });
    });
  },
  createProduct: async function (myobj) {
    var db = await mongoUtil.getDb();
    var dbo = await db.db("webstore");

    return new Promise(function (resolve, reject) {
      dbo.collection("products").insertOne(myobj, function (err, res) {
        if (err) reject(err);
        resolve(res);
      });
    });
  },
  updateProduct: async function (id, myobj) {
    var db = await mongoUtil.getDb();
    var dbo = await db.db("webstore");

    var myquery = { _id: new ObjectId(id) };
    var myObj = {
      $set: myobj,
    };

    dbo.collection("products").updateOne(myquery, myObj, function (err, res) {
      if (err) throw err;
      console.log("1 product updated");
      db.close();
    });
  },
  removeProduct: async function (id) {
    var db = await mongoUtil.getDb();
    var dbo = await db.db("webstore");

    var myquery = { _id: new ObjectId(id) };

    dbo.collection("products").remove(myquery, function (err, res) {
      if (err) throw err;
      console.log("1 product eliminated");
      db.close();
    });
  },
};
