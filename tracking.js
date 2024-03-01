window.addEventListener("load", (event) => {
    // since we don't control how or when elements on the page render, wrap all events in a 5 second timeout for consistency
    setTimeout(() => {
        console.log(gtag)

        const productDetail = $(".product-detail")
        const productTitle = $(".product-title h1");

        // session start event
        var sessionStarted = getCookie("session_started");
        if (!sessionStarted) {
            gtag('event', 'session_start', {
                'event_category': 'user session',

            });

            setCookie('session_started', true);
        }


        // first visit event. Fires only if user does not have site_visitor in localstorage
        var siteVisitor = localStorage.getItem('site_visitor')
        if (!siteVisitor) {
            gtag('event', 'first_visit', {
                'event_category': 'new user',
            });

            localStorage.setItem("site_visitor", true);
        }

        // successful login check for .user-info-logged-in class on the my account page and set cookie to only fire once per session
        var loggedInCookie = getCookie("logged_in");
        var loggedInClass = document.querySelector('.user-info-logged-in')
        if (loggedInClass && !loggedInCookie) {
            gtag('event', 'login', {
                'event_category': 'form submission',
                'event_label': 'login form submit'
            });
            setCookie('logged_in', true)
        }

        $(".buy").click(function () {
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
                        quantity: parseFloat($(currentProductCard).find(".controls .quantity .input-text").val()) || 1
                    },
                ]
            });

        })

        // add-to-cart pdp page

        $(".product-detail button").click(function () {
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


        // view item on pdp page
        if (productDetail && window.location.href.indexOf("product-details") > -1) {
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
                        quantity: 1
                    },
                ]
            });
        }


        // my catalog select item event
        $(".product-card a").click(function () {
            const currentProductCard = $(this).parents('.product-card')
            console.log('select item fired on my catalog')
            console.log(currentProductCard)
            gtag('event', 'select_item', {
                currency: "USD",
                value: parseFloat($(currentProductCard).find(".price-view .price .price-small:first-of-type").text()) || 0.00,
                items: [
                    {
                        item_id: $(currentProductCard).attr('id') || '',
                        item_name: $(currentProductCard).find(".product-description").text() || '',
                        price: parseFloat($(currentProductCard).find(".price-view .price .price-small:first-of-type").text()) || 0.00,
                        quantity: 1
                    },
                ]
            });
        })

        // mini cart select item event
        $(".group-style-sku-parent a").click(function () {
            let productName = $(this).closest('.product-name').textContent;
            gtag('event', 'select_item', {
                'event_category': 'click',
                'event_label': productName
            });
        })

        // full cart view select item event
        $(".orderline a").click(function () {
            let productName = $(this).closest('.product-name').textContent;
            gtag('event', 'select_item', {
                'event_category': 'click',
                'event_label': productName
            });
        })


        // view cart
        if (window.location.href.indexOf("shopping-cart") > -1) {
            gtag('event', 'view_cart', {
                'event_category': 'page view',
            });

        }



        // begin checkout event
        const shippingStepLink = document.querySelector(".shipping-step a")
        if (shippingStepLink && shippingStepLink.classList.contains('active')) {
            gtag('event', 'begin_checkout', {
                'event_category': 'page view'
            });
        }




        $(".delete-orderline").click(function () {
            console.log('remove item clicked')
            const miniCartItem = $(this).parents('.mini-cart-contents .item')
            let miniCartItemQuantity = parseFloat($(miniCartItem).find('.input-text').val()) || 1;

            gtag('event', 'remove_from_cart', {
                currency: "USD",
                value: ''
            })

        })
    }, 5000);
})



// get and set cookie functions

// session cookie is set
function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + ";" + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
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