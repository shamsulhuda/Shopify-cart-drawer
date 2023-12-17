window.addEventListener("DOMContentLoaded",()=>{  
  function onChangeSubmitHandler(event){
    event.target.form.submit();
  }
  document.querySelectorAll('.shopify-currency-form, .language_selector').forEach((elm)=>{
    elm.addEventListener('change',onChangeSubmitHandler);
  });


  // Cart Drawer

  const showDawer = ()=>{
    $("#offcanvasRight").offcanvas('show');
  }
  
  $(document).on("click", "#cartIcon", function(event){
    if(routes.cart_type == 'drawer'){
      event.preventDefault();
      console.log("Cliked on cart");
      showDawer();
      return false;
    }
  })
})
