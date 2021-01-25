$("document").ready(function () {
  const params = new URLSearchParams(window.location.search);
  let productID = params.get("productID");
  if (productID) {
    $.post("/get-product", window.location.search, function (res) {
      if (res.error) {
        alert(res.error);
      } else {
        $("#actualProduct_id").text(res._id);
        $("#actualProduct_name").text(res.name);
        $("#actualProduct_price").text(`${res.price / 100}`);
        $("#actualProduct_description").text(res.description);

        let info = $("#product_info").html();

        $("#edit").click(function () {
          $("#edit").css("display", "none");
          $(".toEdit").css("display", "block");
          $(".edit_input").replaceWith(function () {
            return `<input class="${
              this.className
            }" name="${$(this).attr("id")}" id="${$(this).attr("id")}" value="${$(this).text()}"></input>`;
          });
        });
        $("#cancel").click(function () {
          $("#edit").css("display", "block");
          $(".toEdit").css("display", "none");
          $("#product_info").html(info);
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
        });

        $('#delete_submit').click(function(event){
          event.preventDefault();
          $.post("/remove-product", window.location.search, function (res) {
            if (res.error) {
              alert(res.error);
            } else {
              window.location = `/search`;
            }
          });
        });
        $('#edit_submit').click(function(event){
          event.preventDefault();
          $("#product-form").submit();

          if($("#actualProduct").valid()){
            $.post("/update-product", $("#actualProduct").serialize()+window.location.search.slice(1), function (res) {
              if (res.error) {
                alert(res.error);
              } else {
                window.location.reload();
              }
            });
          }
        });
      }
    });
  }
});
