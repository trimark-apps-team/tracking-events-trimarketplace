window.addEventListener("load", (event) => {
    const dataLayer = window.dataLayer || [];
    console.log(dataLayer)
    dataLayer.push({ ecommerce: null });  // Clear the previous ecommerce object.

// session start event
    var sessionStarted = getCookie("session_started");
    if(!sessionStarted) {
        dataLayer.push({
            event: 'session_start'
        });
        dataLayer.push({
            event: 'first_visit'
        })
        setCookie('session_started', true);
    }
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