const MongoClient = require("mongodb").MongoClient;
const url = process.env.URL;

module.exports = {
  getDb: async function() {
    console.log('Connecting to the database...')
    return new Promise(function (resolve, reject) {
      MongoClient.connect(url, { useUnifiedTopology: true }, async function (err, db) {
        if (err) reject (err);
        console.log('Successed Connection.');
        resolve(db);
      });
    });
  },
};
