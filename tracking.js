window.addEventListener("load", (event) => {
    const dataLayer = window.dataLayer || [];
    console.log(dataLayer)
    dataLayer.push({ ecommerce: null });  // Clear the previous ecommerce object.
    const btn = document.querySelector("button");
    const productDetail = document.querySelector(".product-detail")
    const downLoadDocument = document.querySelector(".download-document")

// session start event
    var sessionStarted = getCookie("session_started");
    if(!sessionStarted) {
        dataLayer.push({
            event: 'session_start',
            eventCategory: 'user',
            eventLabel: ''
        });
        dataLayer.push({
            event: 'first_visit',
            eventCategory: 'user',
            eventLabel: ''
        })
        setCookie('session_started', true);
    }

// successful login check for .user-info-logged-in class on the my account page and set cookie to only fire once per session
    var loggedInCookie = getCookie("logged_in");
    var loggedInClass = document.querySelector('.user-info-logged-in')
    if(loggedInClass && !loggedInCookie) {
        dataLayer.push({
            event: 'login',
            eventCategory: 'form',
            eventLabel: ''
        });
        setCookie('logged_in', true)
    }

// add to cart click event
    $("button").click(function() {
        console.log(this.innerHTML)
        if(this.innerHTML === 'ADD TO CART') {
            console.log('add to cart button clicked')
            dataLayer.push({
                event: 'add_to_cart',
                eventCategory: 'click'
            });
        }
    })


// view cart
    if (window.location.href.indexOf("shopping-cart") > -1) {
        dataLayer.push({
            event: 'view_cart',
            eventCategory: 'page view',
            eventLabel: ''
        });
    }

    // view item
    if(productDetail && window.location.href.indexOf("product-details") > -1) {
        const itemNumber = document.querySelector(".item-number-top span").textContent;
        const productTitle = document.querySelector(".product-title h1");
        dataLayer.push({
            event: 'view_item',
            eventCategory: 'page view',
            eventLabel: productTitle
            
        });
    }

    // begin checkout event
    const shippingStepLink = document.querySelector(".shipping-step a")
    if(shippingStepLink.classList.contains('active')) {
        dataLayer.push({
            event: 'begin_checkout',
            eventCategory: 'page view',
            eventLabel: ''
        });
    }


    // leaves website
    window.addEventListener('beforeunload', function(e) {
        const lastPageVisited = window.location.href
        dataLayer.push({
            event: 'outbound_click',
            eventCategory: 'click',
            eventLabel: lastPageVisited
        })
      });

      $(".download-document").click(function() {
        console.log('download button clicked')
        const pageTitle = document.querySelector(".page-title")
        dataLayer.push({
            event: 'file_download',
            eventCategory: 'click',
            eventLabel: pageTitle
        })
      })

      $(".delete-orderline").click(function() {
        console.log('remove item clicked')
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