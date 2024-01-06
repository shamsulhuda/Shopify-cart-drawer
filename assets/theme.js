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
      $('#offcanvasRightLabel').html(`Cart &bull; ${cart.item_count} ${cart.item_count > 1 ? 'items':'item'}`);
      $('[data-subtotal]').html(Shopify.formatMoney(cart.total_price, routes.currency));
      if(cart.item_count == 0){
        $(document).find('#offcanvasRight').addClass('cart-empty');
        $(document).find('[name="checkout"]').attr('disabled', true);
      }else{
        $(document).find('#offcanvasRight').removeClass('cart-empty');
        $(document).find('[name="checkout"]').attr('disabled', false);
      }
    })
  }

  const updateQuantity = (line, qty) => {
    jQuery.post('/cart/change.js',{
      line: line,
      quantity: qty
    }).then(()=>{
      updateDrawerCart();
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
    updateQuantity(line,currentQuantity);
  });

  $(document).on("change", ".qty_selector input", function(){
    let line = $(this).data('line');
    let qty = $(this).val();
    console.log("Quantity changed");
    updateQuantity(line,qty);
  });

  $(document).on("click", ".remove-item", function(e){
    e.preventDefault();
    let line = $(this).data('line');
    updateQuantity(line,0);
  })

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
