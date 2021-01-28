$("document").ready(function () {
  $("#product-form").submit(function(e) {
    e.preventDefault();
  }).validate({
    rules: {
      id: "required",
    },
    messages: {
      id: "Ingrese el id del producto.",
    },
    submitHandler: function (form) {
      $.ajax({
        url: "/products/" + $('#id').val(),
        type: "GET",
        error: function(err){
            alert('ID no coincide con ningún producto');
          },
        success: function(res){
          window.location = `/product?id=${res._id.toString()}`;
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
      $.ajax({
        url: "/products",
        type: "POST",
        data: $("#actualProduct").serialize(),
        error: function(err){
            alert(err);
        },
        success: function(res){
          alert('Product Created with the ID '+res._id);
          window.location.reload();
        }
      });
    }
  });
});
