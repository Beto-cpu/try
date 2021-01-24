$("document").ready(function () {
  $("#product-form").validate({
    rules: {
      productID: "required",
    },
    messages: {
      productID: "Ingrese el id del producto.",
    },
    submitHandler: function (form) {
      $.post("/get-product", $("#product-form").serialize(), function (res) {
        if (res.error) {
          alert(res.error);
        } else {
          window.location = `/product?&productID=${res._id.toString()}`;
        }
      });
    },
  });

  $("#actualProduct").validate({
    rules: {
      actualProduct_name: "required",
      actualProduct_price: "required",
    },
    messages: {
      actualProduct_name: "required",
      actualProduct_price: "required",
    },
    submitHandler: function (form) {
      $.post("/create-product", $("#actualProduct").serialize(), function (res) {
        if (res.error) {
          alert(res.error);
        } else {
          alert('Product Created with the ID '+res.insertedId);
          window.location.reload();
        }
      });
    }
  });
});
