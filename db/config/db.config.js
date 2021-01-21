const MongoClient = require("mongodb").MongoClient;
const url = process.env.URL;

module.exports = {
  getDb: function() {
    return MongoClient.connect(url, { useUnifiedTopology: true }).then(function (db) {
      return db;
    });
  },
};
