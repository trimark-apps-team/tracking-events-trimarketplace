window.addEventListener("load", (event) => {
    // since we don't control how or when elements on the page render, wrap all events except mutation observers in a 5 second timeout for consistency
    setTimeout(() => {
        if (!window.location.href.includes('checkout')) {
            sessionStorage.removeItem('checkout_items')
            sessionStorage.removeItem('checkout_value')
            sessionStorage.removeItem('purchased')
            sessionStorage.removeItem('began_checkout')
            sessionStorage.removeItem('cart_viewed')
        }
        const productDetail = $(".product-detail")

        // session start event
        var sessionStarted = getCookie("session_started");
        if (!sessionStarted) {
            gtag('event', 'session_start', {
                'event_category': 'user session',

            });

            setCookie('session_started', true);
        }


        // search event
        $(".search-input .header-search a").unbind().click(function () {
            let inputVal = $("#header-search").val();
            gtag('event', 'search', {
                'event_category': 'site search',
                'event_label': inputVal || ''

            });
        })

        // search results list event
        if (window.location.href.includes('ecom-search')) {
            let searchResultsTitle = $(".parent-category-title .name").text() || ''
            let items = []
            $('.product-card').each(function (index) {
                let item = {
                    item_id: $(this).attr('id') || '',
                    item_name: $(this).find(".product-description").text() || '',
                    price: parseFloat($(this).find(".price-view .price .price-small:first-of-type").text().replace(/[^.0-9]/g, '')) || 0.00,
                    quantity: Number($(this).find(".controls .quantity .input-text").val()) || 1
                }
                items.push(item)
                if ($('.product-card').length - 1 === index) {
                    gtag("event", "view_item_list", {
                        item_list_name: searchResultsTitle,
                        items: items
                    });
                    gtag('event', 'view_search_results', {
                        'event_category': 'site_search_results',
                        'event_label': searchResultsTitle

                    })
                }
            })
        }

        // my catalog results list
        if (window.location.href.includes('mycatalog') && !window.location.href.includes('ecom-search')) {
            let searchResultsTitle = $(".product-list-header .category-name h1").text() || ''
            let items = []
            $('.product-card').each(function (index) {
                let item = {
                    item_id: $(this).attr('id') || '',
                    item_name: $(this).find(".product-description").text() || '',
                    price: parseFloat($(this).find(".price-view .price .price-small:first-of-type").text().replace(/[^.0-9]/g, '')) || 0.00,
                    quantity: Number($(this).find(".controls .quantity .input-text").val()) || 1
                }
                items.push(item)
                if ($('.product-card').length - 1 === index) {
                    gtag("event", "view_item_list", {
                        item_list_name: searchResultsTitle,
                        items: items
                    });
                }
            })
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
        var loggedInClass = $('.user-info-logged-in')
        var loggedIn = getCookie("logged_in");
        if (loggedInClass && !loggedIn) {
            gtag('event', 'login', {
                'event_category': 'form submission',
                'event_label': 'login form submit'
            });
            setCookie('logged_in')

        }

        // view item on pdp page
        if (productDetail && window.location.href.indexOf("product-details") > -1) {
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

            gtag('event', 'select_item', {
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

    }, 1000);


    // view cart does not need to be in a set timeout
    if (window.location.href.indexOf("shopping-cart") > -1) {
        if (!sessionStorage.getItem('cart_viewed')) {
            $.getJSON('/delegate/ecom-api/orders/current', (data) => {
                let orderLines = data.orderLines
                let totalCartPrice = data.totalPrice
                let ecommItems = []
                orderLines.forEach((orderLine, index) => {
                    let item = {
                        item_id: orderLine.item.itemNumber,
                        item_name: orderLine.item.name,
                        price: orderLine.lineAmounts.net,
                        quantity: orderLine.quantity
                    }
                    ecommItems.push(item)
                    if (orderLines.length - 1 === index) {

                        gtag('event', 'view_cart', {
                            currency: "USD",
                            value: totalCartPrice || 0.00,
                            items: ecommItems
                        });

                    }
                })
            });
            sessionStorage.setItem('cart_viewed', true);
        }
    }
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




// remove from cart in mini cart widget
const domObserver = new MutationObserver(() => {
    const deleteItem = $('.mini-cart-contents .delete-orderline');
    const shoppingCartRemovalModalButton = $(".shopping-cart-item-removal-modal button")
    const productCard = $('.product-list-container .product-card')
    const checkoutConfirmation = $('.checkout-container .confirmation-container')
    const shippingStep = $('.checkout-container .checkout-container')
    const productDetail = $(".product-detail")
    const shoppingCartContainer = $('.shopping-cart-container')
    if (deleteItem) {
        for (var i = 0; i < deleteItem.length; i++) {
            let item = $(deleteItem[i]).parents('.item')
            let itemName = $(item).find('h4 a').text() || ''
            let itemID = $(item).find('.item-number').text().replace(/[^.0-9]/g, '');
            let itemQuantity = Number($(item).find('.quantity input').val())
            let itemPrice = parseFloat($(item).find('.price-small').text().replace(/[^.0-9]/g, ''))
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
        }
    }

    // full cart page remove from cart event
    if (shoppingCartRemovalModalButton) {
        let modalContent = $(shoppingCartRemovalModalButton).parents('.modal-body')
        let itemName = $(modalContent).find('.product-name').text()
        let itemID = $(modalContent).find('.number').text().replace(/[^.0-9]/g, '')
        let htmlItemIDString = `.item-${itemID}`
        let itemPrice = parseFloat($(htmlItemIDString).find('.price-small').text().replace(/[^.0-9]/g, ''))
        let itemQuantity = Number($(htmlItemIDString).find('.quantity input').val())
        $(shoppingCartRemovalModalButton).unbind().click(function () {
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

    // mycatalog product card
    if (productCard) {
        // add to cart my catalog page
        $(".buy").unbind().click(function () {
            const currentProductCard = $(this).parents('.product-card')
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
    }

    // begin checkout event
    if (shippingStep && window.location.href.includes('checkoutpage/deliverymethod')) {
        $.getJSON('/delegate/ecom-api/orders/current', (data) => {
            let orderLines = data.orderLines
            let totalCartPrice = data.totalPrice
            let ecommItems = []
            orderLines.forEach((orderLine, index) => {
                let item = {
                    item_id: orderLine.item.itemNumber,
                    item_name: orderLine.item.name,
                    price: orderLine.lineAmounts.net,
                    quantity: orderLine.quantity
                }
                ecommItems.push(item)
                if (orderLines.length - 1 === index) {
                    if (!sessionStorage.getItem('began_checkout')) {
                        gtag('event', 'begin_checkout', {
                            currency: "USD",
                            value: totalCartPrice || 0.00,
                            items: ecommItems
                        });

                        sessionStorage.setItem('checkout_items', JSON.stringify(ecommItems))
                        sessionStorage.setItem('checkout_value', totalCartPrice)
                        sessionStorage.setItem('began_checkout', true)
                    }
                }

            })

        });
    }


    //purchase
    if (checkoutConfirmation && window.location.href.includes('checkoutpage/confirmation')) {
        let items = JSON.parse(sessionStorage.getItem('checkout_items'))
        let grandTotal = parseFloat($(".order-summary-component .total .amount").text().replace(/[^.0-9]/g, '')) || 0.00
        parseFloat(sessionStorage.getItem('checkout_value'))

        if (!sessionStorage.getItem('purchased')) {
            gtag("event", "purchase", {
                // using date.now for transaction id since we dont have access to the order number after purchase in the ui
                transaction_id: `T_${Date.now()}`,
                value: grandTotal,
                currency: "USD",
                items: items
            });
            sessionStorage.setItem('purchased', true);
        }
    }



    // wishlist page add to cart modal (adds all products in wishlist to cart)
    if (window.location.href.includes('favorite-details') && $(".order-summary-component header h3").text().toLowerCase() == 'wishlist summary') {
        $(".reorder-modal .btn-wrapper button.add-to-cart").unbind().click(function () {
            console.log('wish list add to cart clicked')
            let products = $(".product-list-container .card")
            let items = []
            let totalValue = 0;
            products.each(function (index) {
                let item = {
                    item_id: $(this).attr('id') || '',
                    item_name: $(this).find(".product-description").text() || '',
                    price: parseFloat($(this).find(".price-view .price .price-small:first-of-type").text().replace(/[^.0-9]/g, '')) || 0.00,
                    quantity: Number($(this).find(".controls .quantity .input-text").val()) || 1
                }
                totalValue += item.price
                items.push(item)
                if (products.length - 1 === index) {
                    console.log('totalValue', totalValue)
                    gtag('event', 'add_to_cart', {
                        currency: "USD",
                        value: totalValue,
                        items: items
                    });
                }
            })
        })
    }

    // add-to-cart pdp page
    $(".product-detail button").unbind().click(function () {
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
    quickOrderaddToCartButton.unbind().click(function () {
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
                gtag('event', 'add_to_cart', {
                    currency: "USD",
                    value: parseFloat($(".order-summary-component .prices .amount").text().replace(/[^.0-9]/g, '')) || 0.00,
                    items: items
                });
            }
        })
    })

    // saved cart add to cart events
    if ($("h1.page-title").text().toLowerCase() === 'my saved cart') {

        console.log('on saved cart page')

        //cart icon add to cart button
        $(".cart-with-icon.orderline-add-cart-btn").unbind().click(function () {
            console.log('saved to cart cart icon button clicked')
            let item = $(this).parents('.item')
            let itemValue = parseFloat(item.find(".qty-total-container .total-amount").text().replace(/[^.0-9]/g, '')) || 0.00
            let itemQuantity = Number(item.find(".quantity input").val()) || 1
            let itemPrice = parseFloat(item.find(".product-info .pricing .price").text().replace(/[^.0-9]/g, '')) || 0.00
            let itemId = item.find(".product-info .item-num .value").text().replace(/[^.0-9]/g, '') || ''
            let itemName = item.find(".product-info .product-name").text() || ''
            gtag('event', "add_to_cart", {
                currency: "USD",
                value: itemValue,
                items: [
                    {
                        item_id: itemId,
                        item_name: itemName,
                        price: itemPrice,
                        quantity: itemQuantity
                    },
                ]
            })
        })

        // add to cart button order summary (adds everything in saved cart list)
        $(".reorder-modal .btn-wrapper button.add-to-cart").unbind().click(function () {
            let products = $(".orderlines .orderline .item")
            items = []
            products.each(function (index) {
                let itemQuantity = Number($(this).find(".quantity input").val()) || 1
                let itemPrice = parseFloat($(this).find(".product-info .pricing .price").text().replace(/[^.0-9]/g, '')) || 0.00
                let itemId = $(this).find(".product-info .item-num .value").text().replace(/[^.0-9]/g, '') || ''
                let itemName = $(this).find(".product-info .product-name").text() || ''
                items.push({
                    item_id: itemId,
                    item_name: itemName,
                    price: itemPrice,
                    quantity: itemQuantity
                })

                if (products.length - 1 === index) {
                    gtag('event', 'add_to_cart', {
                        currency: "USD",
                        value: parseFloat($(".order-summary-component .prices .amount").text().replace(/[^.0-9]/g, '')) || 0.00,
                        items: items
                    });
                }
            })
        })
    }
});

domObserver.observe(document.body, { childList: true, subtree: true });