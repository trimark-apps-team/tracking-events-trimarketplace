window.addEventListener("load", (event) => {
    const productDetail = document.querySelector(".product-detail")
    const productTitle = document.querySelector(".product-title h1");

// session start event
    var sessionStarted = getCookie("session_started");
    if(!sessionStarted) {
        gtag('event', 'session_start', {
            'event_category': 'user session',
            
          });
      
        setCookie('session_started', true);
    }


// first visit event. Fires only if user does not have site_visitor in localstorage
    var siteVisitor = localStorage.getItem('site_visitor')
    if(!siteVisitor) {
        gtag('event', 'first_visit', {
            'event_category': 'new user',
        });

        localStorage.setItem("site_visitor", true);
    }

// successful login check for .user-info-logged-in class on the my account page and set cookie to only fire once per session
    var loggedInCookie = getCookie("logged_in");
    var loggedInClass = document.querySelector('.user-info-logged-in')
    if(loggedInClass && !loggedInCookie) {
        gtag('event', 'login', {
            'event_category': 'form submission',
            'event_label': 'login form submit'
        });
        setCookie('logged_in', true)
    }

    // add to cart click event on my catalog
    $(".product-card .add-to-cart button").click(function() {
            const currentProductCard = $(this).parents('.product-card')
            console.log('add to cart button clicked on my catalog')
            console.log(currentProductCard)
            gtag('event', 'add_to_cart', {
                currency: "USD",
                value: parseFloat($(currentProductCard).find(".price-view .price .price-small:first-of-type").text()) || 0.00,
                items: [
                  {
                    item_id: $(currentProductCard).attr('id') || '',
                    item_name: $(currentProductCard).find(".product-description").text() || '',
                    price: parseFloat($(currentProductCard).find(".price-view .price .price-small:first-of-type").text()) || 0.00,
                    quantity: parseFloat($(currentProductCard).find(".controls .quantity .input-text").attr('data-decimalquantity')) || 1
                  },
                ]
            });
        
    })

    // add-to-cart pdp page
    $(".product-detail button.add-to-cart").click(function() {
        const productDetail = $(this).parents('.product-detail')
        console.log('add to cart button clicked on PDP page')
        console.log(productDetail)
        gtag('event', 'add_to_cart', {
            currency: "USD",
            value: parseFloat($(productDetail).find(".display-price h2").text()) || 0.00,
            items: [
              {
                item_id: $(productDetail).find('.item-number-top span').text() || '',
                item_name: $(productDetail).find(".product-description").text() || '',
                price: parseFloat($(productDetail).find(".product-pricing .display-price .price").text()) || 0.00,
                quantity: parseFloat($(productDetail).find(".order-actions .input-text").val()) || 1
              },
            ]
        });
    })


// view cart
    if (window.location.href.indexOf("shopping-cart") > -1) {
        gtag('event', 'view_cart', {
            'event_category': 'page view',
        });
 
    }

    // view item on pdp page
    if(productDetail && window.location.href.indexOf("product-details") > -1) {
        const productDetail = $(this).parents('.product-detail')
        console.log('view item PDP page')
        console.log(productDetail)
        gtag('event', 'view_item', {
            currency: "USD",
            value: parseFloat($(productDetail).find(".display-price h2").text()) || 0.00,
            items: [
              {
                item_id: $(productDetail).find('.item-number-top span').text() || '',
                item_name: $(productDetail).find(".product-description").text() || '',
                price: parseFloat($(productDetail).find(".product-pricing .display-price .price").text()) || 0.00,
                quantity: parseFloat($(productDetail).find(".order-actions .input-text").val()) || 1
              },
            ]
        });
    }

    // begin checkout event
    const shippingStepLink = document.querySelector(".shipping-step a")
    if(shippingStepLink && shippingStepLink.classList.contains('active')) {
        gtag('event', 'begin_checkout', {
            'event_category': 'page view'
        });
    }




      $(".delete-orderline").click(function() {
        console.log('remove item clicked')
      })

      // my catalog select item event
      $(".product-card a").click(function() {
        let productName = $(this).closest('.product-name').textContent;
        gtag('event', 'select_item', {
            'event_category': 'click',
            'event_label': productName
        });
      })

      // mini cart select item event
      $(".group-style-sku-parent a").click(function() {
        let productName = $(this).closest('.product-name').textContent;
        gtag('event', 'select_item', {
            'event_category': 'click',
            'event_label': productName
        });
      })

      // full cart view select item event
      $(".orderline a").click(function() {
        let productName = $(this).closest('.product-name').textContent;
        gtag('event', 'select_item', {
            'event_category': 'click',
            'event_label': productName
        });
      })


});



// get and set cookie functions

// session cookie is set
  function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + ";" + ";path=/";
  }
  
  function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }


// 
// dataLayer.push({
// event: "add_to_cart",
// ecommerce: {
//  currency: "USD",
//  value: 7.77,
//  items: [{
// 	 item_id: "P000117967",
// 	 item_name: "7-Prong Rack",
// 	 affiliation: "Trimark Store",
// 	 index: 0,
// 	 item_brand: "TriMark",
// 	 location_id: "ChIJIQBpAG2ahYAR_6128GcTUEo",
// 	 price: 11.99,
// 	 quantity: 1
// 	 },{
// 	 item_id: "P000091436",
// 	 item_name: "2' Step Ladder",
// 	 affiliation: "Trimark Store",
// 	 index: 1,
// 	 item_brand: "TriMark",
// 	 location_id: "ChIJIQBpAG2ahYAR_6128GcTUEp",
// 	 price: 9.99,
// 	 quantity: 1
// 	 }
//  ]
// }
// });

// window.onload = () => {
// $(".buy").first().click(function(e){
// 		 // console.log(e.closest(".product-card"));  
// 	 console.log(e);    
//  });
// $(".add-to-cart").first().click(function(e){
	 
// 		 gtag("event", "add_to_cart", {
// 						 transaction_id: "T_12345_2",
// 						 value: 25.42,
// 						 tax: 4.90,
// 						 shipping: 5.99,
// 						 currency: "USD",
// 						 items: [
// 						 {
// 							 item_id: e.target.id,
// 							 item_name: "Product Name",
// 							 affiliation: "Trimark Merchandise Store",
// 							 price: 9.99,
// 							 quantity: 1
// 						 }]
// 			 });

// 	 console.log(e.target.id);

// });