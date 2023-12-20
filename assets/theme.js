window.addEventListener("DOMContentLoaded",()=>{  
  function onChangeSubmitHandler(event){
    event.target.form.submit();
  }
  document.querySelectorAll('.shopify-currency-form, .language_selector').forEach((elm)=>{
    elm.addEventListener('change',onChangeSubmitHandler);
  });


  // Cart Drawer

  const showDawer = async ()=>{
    $("#offcanvasRight").offcanvas('show');
  }
  
  $(document).on("click", "#cartIcon", function(event){
    if(routes.cart_type == 'drawer'){
      event.preventDefault();
      console.log("Cliked on cart");
      showDawer();
      return false;
    }
  });

  $(document).on("click", ".qty_selector button[type='button']", function(e){
    let btnType = $(this).data('qty');
    let input = $(this).parent().find('input');
    let line = input.data('line');
    let currentQuantity = parseInt(input.val());

    if(btnType == 'minus' && currentQuantity > 0){
      currentQuantity = currentQuantity - 1;
      input.val(currentQuantity);
    }else if(btnType == 'plus'){
      currentQuantity = currentQuantity + 1;
      input.val(currentQuantity);
    }
  });

  $(document).on("change", ".qty_selector input", function(){
    let line = $(this).data('line');
    let qty = $(this).val();
    console.log("Quantity changed");
  });

  // add to cart
  $(document).on("submit", "form[action='/cart/add']", function(event){
    event.preventDefault();
    $.ajax({
      type: 'POST',
      url: '/cart/add.js',
      data: $(this).serialize(),
      dataType: 'json',
      success: function(data){
        console.log("success::", data);
        showDawer();
      },
      error: function(err){
        console.log(err);
      }
    })
  })

})
