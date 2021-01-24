var mongoUtil = require("../config/db.config");
const stripe = require("stripe")(
  "sk_test_51IBscADopkXLPa8T5OoCQiQliH1UvuvutLmwXWwQotRCZPxvSBoOydxkvwYBb6suhBXlWIKYK3tKZReoR0vIL2I800eICS4yvX"
);

module.exports = {
  registerTransaction: async function (myobj) {
    var db = await mongoUtil.getDb();
    var dbo = await db.db("webstore");

    dbo.collection("transactions").insertOne(myobj, function (err, res) {
      if (err) throw err;
      console.log("1 transaction inserted");
      db.close();
    });
  },
  updateTransaction: async function (transactionID) {
    var db = await mongoUtil.getDb();
    var dbo = await db.db("webstore");
    const session = await stripe.checkout.sessions.retrieve(transactionID);

    var myquery = { transactionID: session.id };
    var newvalues = {
      $set: {
        customer: session.customer,
        payment_status: session.payment_status,
      },
    };

    dbo
      .collection("transactions")
      .updateOne(myquery, newvalues, function (err, res) {
        if (err) throw err;
        console.log("1 transaction updated");
        db.close();
      });
  },
};
