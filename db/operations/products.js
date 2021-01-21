var mongoUtil = require('../config/db.config');
var ObjectId = require('mongodb').ObjectID;

module.exports = {
  getProductByID: async function( id ) {
    var db = await mongoUtil.getDb();
    var dbo = await db.db("webstore");
    return new Promise(function(resolve, reject){
      dbo.collection("products").findOne({"_id": new ObjectId(id)}, function(err, res) {
        if (err) {
          reject(err);  
        } else {
          resolve(res);
        }        
      });
    });
  }
};