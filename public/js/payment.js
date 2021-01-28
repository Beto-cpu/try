document.addEventListener("DOMContentLoaded", () => {
  console.log('ready');
  var stripe = Stripe(
    "pk_test_51IERlKAewgYYy1mggyn2GPGH01vU4ik7VgihDDT7DKIZrjGTBBlsLfdnBBCSLzVtJmwXzazDJyYgbUx5OFZCH6OY00imMO7wU0"
  );
  var checkoutButton = document.getElementById("buy-button");

  var purchase = {
    id: "6011b26a23436a4d98700834",
    quantity: 1
  };

  checkoutButton.addEventListener("click", function () {
    fetch("/transactions/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(purchase)
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (session) {
        if (session.error) {
          alert(session.error);
          return;
        }
        return stripe.redirectToCheckout({ sessionId: session.id });
      });
  });
});
