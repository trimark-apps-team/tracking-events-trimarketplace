window.addEventListener("load", (event) => {
    // since we don't control how or when elements on the page render, wrap all events except mutation observers in a 5 second timeout for consistency
    setTimeout(() => {

        if (!window.location.href.includes('checkout')) {
            sessionStorage.removeItem('checkout_items')
            sessionStorage.removeItem('checkout_value')
        }
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
                value: parseFloat($(currentProductCard).find(".price-view .price .price-small:first-of-type").text().replace(/[^.0-9]/g, '')) || 0.00,
                items: [
                    {
                        item_id: $(currentProductCard).attr('id') || '',
                        item_name: $(currentProductCard).find(".product-description").text() || '',
                        price: parseFloat($(currentProductCard).find(".price-view .price .price-small:first-of-type").text().replace(/[^.0-9]/g, '')) || 0.00,
                        quantity: Number($(currentProductCard).find(".controls .quantity .input-text").val()) || 1
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
                value: parseFloat($(productDetail).find(".product-pricing .display-price .price").text().replace(/[^.0-9]/g, '')) || 0.00,
                items: [
                    {
                        item_id: $(productDetail).find('.item-number-top span').text() || '',
                        item_name: $(productDetail).find(".product-description").text() || '',
                        price: parseFloat($(productDetail).find(".product-pricing .display-price .price").text().replace(/[^.0-9]/g, '')) || 0.00,
                        quantity: Number($(productDetail).find(".order-actions .input-text").val()) || 1
                    },
                ]
            });
        })




        // quick order add to cart on cart page
        let quickOrderaddToCartButton = $('.quick-order-entry-container #by-item-number .add-to-cart button')
        console.log(quickOrderaddToCartButton)
        quickOrderaddToCartButton.click(function () {
            // item has been added to cart via quick entry
            console.log('add to cart clicked')
            const quickOrderItem = $(".quick-order-entry-container .quick-order-item-list .item-list .field .item-details-preview")
            const quickOrderInformation = $(".quick-order-entry-container .quick-order-item-list .item-list .field .item-details-preview .item-preview .information")
            let items = [];
            console.log(quickOrderItem)
            $(quickOrderInformation).each(function (index) {
                let itemField = $(this).parents(".field")
                let itemName = $(this).find('h4').text().replace(/[\t\n\r]/gm, '') || ''
                let itemID = $(this).find('.item-number span').eq(1).text() || ''
                let itemQuantity = Number($(itemField).find('.quantity input').val()) || 1
                let item = {
                    item_id: itemID,
                    item_name: itemName,
                    quantity: itemQuantity,
                }
                items.push(item)
                if (quickOrderInformation.length - 1 === index) {
                    console.log('loop ends');
                    gtag('event', 'add_to_cart', {
                        currency: "USD",
                        value: parseFloat($(".order-summary-component .prices .amount").text().replace(/[^.0-9]/g, '')) || 0.00,
                        items: items
                    });
                }
            })
        })



        // view item on pdp page
        if (productDetail && window.location.href.indexOf("product-details") > -1) {
            console.log('view item PDP page')
            console.log(productDetail)
            gtag('event', 'view_item', {
                currency: "USD",
                value: parseFloat($(productDetail).find(".product-pricing .display-price .price").text().replace(/[^.0-9]/g, '')) || 0.00,
                items: [
                    {
                        item_id: $(productDetail).find('.item-number-top span').text() || '',
                        item_name: $(productDetail).find(".product-description").text() || '',
                        price: parseFloat($(productDetail).find(".product-pricing .display-price .price").text().replace(/[^.0-9]/g, '')) || 0.00,
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
                value: parseFloat($(currentProductCard).find(".price-view .price .price-small:first-of-type").text().replace(/[^.0-9]/g, '')) || 0.00,
                items: [
                    {
                        item_id: $(currentProductCard).attr('id') || '',
                        item_name: $(currentProductCard).find(".product-description").text() || '',
                        price: parseFloat($(currentProductCard).find(".price-view .price .price-small:first-of-type").text().replace(/[^.0-9]/g, '')) || 0.00,
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
            let orderlines = $(".orderline");
            let items = [];

            $(orderlines).each(function (index) {
                let itemID = $(this).find('.info-container .item-number').text().replace(/[^.0-9]/g, '') || ''
                let itemName = $(this).find('.product-name').text() || ''
                let price = parseFloat($(this).find('.line-total .price-small').text().replace(/[^.0-9]/g, '')) || 0.00
                let quantity = Number($(this).find('.quantity input').val()) || 1
                let item = {
                    item_id: itemID,
                    item_name: itemName,
                    price: price,
                    quantity: quantity,
                }
                items.push(item)
                if (orderlines.length - 1 === index) {
                    console.log('loop ends');
                    gtag('event', 'view_cart', {
                        currency: "USD",
                        value: parseFloat($(".order-summary-component .prices .amount").text().replace(/[^.0-9]/g, '')) || 0.00,
                        items: items
                    });

                }
            })

        }

        // save cart items to session storage after clicking checkout
        $(".order-summary-component button.continue").unbind().click(function (e) {
            e.preventDefault()
            console.log($(this))
            let cartValue = parseFloat($(".order-summary-component .amount").text().replace(/[^.0-9]/g, '')) || 0.00
            let orderlines = $(".orderline");
            let items = [];
            $(orderlines).each(function (index) {
                let itemID = $(this).find('.info-container .item-number').text().replace(/[^.0-9]/g, '') || ''
                let itemName = $(this).find('.product-name').text() || ''
                let price = parseFloat($(this).find('.line-total .price-small').text().replace(/[^.0-9]/g, '')) || 0.00
                let quantity = Number($(this).find('.quantity input').val()) || 1
                let item = {
                    item_id: itemID,
                    item_name: itemName,
                    price: price,
                    quantity: quantity,
                }
                items.push(item)
                if (orderlines.length - 1 === index) {
                    console.log('loop ends');
                    sessionStorage.setItem('checkout_items', JSON.stringify(items))
                    sessionStorage.setItem('checkout_value', cartValue)

                }
            })
        })



        // begin checkout event
        const shippingStepLink = document.querySelector(".shipping-step a")
        if (shippingStepLink && shippingStepLink.classList.contains('active')) {
            gtag('event', 'begin_checkout', {
                'event_category': 'page view'
            });
        }


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




// remove from cart events
const domObserver = new MutationObserver(() => {
    const deleteItem = $('.mini-cart-contents .delete-orderline');
    const shoppingCarRemovalModalButton = $(".shopping-cart-item-removal-modal button")
    if (deleteItem) {
        for (var i = 0; i < deleteItem.length; i++) {
            let item = $(deleteItem[i]).parents('.item')
            let itemName = $(item).find('h4 a').text() || ''
            let itemID = $(item).find('.item-number').text().replace(/[^.0-9]/g, '');
            let itemQuantity = Number($(item).find('.quantity input').val())
            let itemPrice = parseFloat($(item).find('.price-small').text().replace(/[^.0-9]/g, ''))
            console.log(itemName, itemID, itemQuantity, itemPrice)
            $(deleteItem[i]).unbind().click(function () {
                gtag('event', 'remove_from_cart', {
                    currency: "USD",
                    value: itemPrice || 0.00,
                    items: [
                        {
                            item_id: itemID || '',
                            item_name: itemName || '',
                            price: itemPrice || 0.00,
                            quantity: itemQuantity || 1
                        },
                    ]
                });
            })

            $('.mini-cart-container .go-to-checkout').unbind().click(function () {
                console.log('saving checkout data in session storage')
                let items = []
                let cartValue = parseFloat($('.mini-cart-contents .mini-cart-total .sub-total .total-price').text().replace(/[^.0-9]/g, '')) || 0.00
                let products = $(".mini-cart-contents .item")
                $(products).each(function (index) {
                    let itemName = $(this).find('h4 a').text() || ''
                    let itemID = $(this).find('.item-number').text().replace(/[^.0-9]/g, '');
                    let itemQuantity = Number($(this).find('.quantity input').val())
                    let itemPrice = parseFloat($(this).find('.price-small').text().replace(/[^.0-9]/g, ''))
                    let item = {
                        item_id: itemID || '',
                        item_name: itemName || '',
                        price: itemPrice || 0.00,
                        quantity: itemQuantity || 1
                    }
                    items.push(item)

                    if ($(products).length - 1 === index) {
                        sessionStorage.setItem('checkout_items', JSON.stringify(items))
                        sessionStorage.setItem('checkout_value', cartValue)
                    }
                })

            })


        }
    }

    if (shoppingCarRemovalModalButton) {
        let modalContent = $(shoppingCarRemovalModalButton).parents('.modal-body')
        let itemName = $(modalContent).find('.product-name').text()
        let itemID = $(modalContent).find('.number').text().replace(/[^.0-9]/g, '')
        let htmlItemIDString = `.item-${itemID}`
        let itemPrice = parseFloat($(htmlItemIDString).find('.price-small').text().replace(/[^.0-9]/g, ''))
        let itemQuantity = Number($(htmlItemIDString).find('.quantity input').val())
        console.log(itemName, itemID, itemQuantity, itemPrice)
        $(shoppingCarRemovalModalButton).unbind().click(function () {
            gtag('event', 'remove_from_cart', {
                currency: "USD",
                value: itemPrice || 0.00,
                items: [
                    {
                        item_id: itemID || '',
                        item_name: itemName || '',
                        price: itemPrice || 0.00,
                        quantity: itemQuantity || 1
                    },
                ]
            });
        })

    }

});

domObserver.observe(document.body, { childList: true, subtree: true });

