$("document").ready(function () {
  const params = new URLSearchParams(window.location.search);
  let id = params.get("id");
  if (id) {
    $.ajax({
      url: "/products/" + id,
      type: "GET",
      success: function (res) {
        // console.log(res);
        $("#id").text(res._id);
        $("#name").text(res.name);
        $("#price").text(`${res.price / 100}`);
        $("#description").text(res.description);

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
            name: "required",
            price: "required",
          },
          messages: {
            name: "required",
            price: "required",
          },
        });

        $("#delete_submit").click(function (event) {
          event.preventDefault();

          $.ajax({
            url: "/products/" + id,
            type: "DELETE",
            error: function(err){
                alert(err);
              },
            success: function(v){
              window.location = '/search';
            }
          });
        });

        $("#edit_submit").click(function (event) {
          event.preventDefault();

          if ($("#actualProduct").valid()) {
            $.ajax({
              url: "/products/" + id,
              type: "PUT",
              data: $("#actualProduct").serialize(),
              error: function(err){
                alert(err);
              },
              success: function(v){
                 window.location.reload();
              }
            });
          }
        });
      },
    });
  }
});
