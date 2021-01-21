document.addEventListener("DOMContentLoaded", () => {
  console.log('ready');
  var stripe = Stripe(
    "pk_test_51IBscADopkXLPa8Ty3OZz07Uqq804s4jntmUAT7ES4b8dTnJXEk51Up5JuIy5Dqv50KmKo9cwV3wB0Alr3ifLYHc00SK12jHAj"
  );
  var checkoutButton = document.getElementById("buy-button");

  var purchase = {
    id: "6009ccba47d2de84219a0475",
  };

  checkoutButton.addEventListener("click", function () {
    fetch("/create-checkout", {
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
        return stripe.redirectToCheckout({ sessionId: session.id });
      })
      .then(function (result) {
        if (result.error) {
          alert(result.error.message);
        }
      })
      .catch(function (error) {
        console.error("Error:", error);
      });
  });
});
