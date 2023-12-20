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

  // update drawer cart
  const updateDrawerCart = async ()=>{
    let cart = await getCartCallback();

    fetch(`${routes.cart_url}?section_id=cart-items`)
    .then(response => response.text())
    .then((data)=>{
      $("#cart-items").html(data);
    })
    .then(async()=>{
      $('.counter').text(cart.item_count);
      $('#offcanvasRightLabel').html(`Cart &bull; ${cart.item_count} ${cart.item_count > 1 ? 'items':'item'}`)
      
    })
  }

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
        setTimeout(async ()=>{
          await updateDrawerCart();
          await showDawer();
        },100)
      },
      error: function(err){
        console.log(err);
      }
    })
  })

})
