window.addEventListener("load", (event) => {

    // collect company name and company id for user
    $.ajax({
        type: 'GET',
        url: "/delegate/ecom-api/users/current",
        success: function (data, status) {
            gtag('set', 'user_properties', {
                company_name: data.activeUserGroup.name,
                company_id: data.activeUserGroup.key
            });

        },
        error: function (jqXHR, status, err) {
            console.log("Get current user info Failed");
        }
    }); // end rhythm enpoint call 

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
            window.setTimeout(() => {
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
            }, 1000)
        }

        // my catalog results list
        if (window.location.href.includes('mycatalog') && !window.location.href.includes('ecom-search')) {
            // wait an extra moment
            window.setTimeout(() => {
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
            }, 1000)

        }

        // first visit event. Fires only if user does not have site_visitor in localstorage
        var siteVisitor = localStorage.getItem('site_visitor')
        if (!siteVisitor) {
            gtag('event', 'first_visit', {
                'event_category': 'new user',
            });
            localStorage.setItem("site_visitor", true);
        }

        // sucessful login
        if (window.location.href.includes('myacount')) {
            var loggedIn = sessionStorage.getItem('logged_in')
            if (!loggedIn) {
                gtag('event', 'login', {
                    'event_category': 'form submission',
                    'event_label': 'login form submit'
                });
                sessionStorage.setItem('logged_in')

            }
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

            // select item on pdp page
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
                        price: orderLine.unitPrice.net,
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





const domObserver = new MutationObserver(() => {
    const deleteItem = $('.mini-cart-contents .delete-orderline');
    const shoppingCartRemovalModalButton = $(".shopping-cart-item-removal-modal button")
    const productCard = $('.product-list-container .product-card')
    const checkoutConfirmation = $('.checkout-container .confirmation-container')
    const shippingStep = $('.checkout-container .checkout-container')
    const productDetail = $(".product-detail")

    // remove from cart in mini cart widget
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
                            price: itemPrice / itemQuantity || 0.00,
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
                value: itemPrice * itemQuantity || 0.00,
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
            const itemID = $(currentProductCard).attr('id') || ''
            const itemName = $(currentProductCard).find(".product-description").text() || ''
            const itemPrice = parseFloat($(currentProductCard).find(".price-view .price .price-small:first-of-type").text().replace(/[^.0-9]/g, '')) || 0.00
            const itemQuantity = Number($(currentProductCard).find(".controls .quantity .input-text").val()) || 1
            gtag('event', 'add_to_cart', {
                currency: "USD",
                value: itemPrice * itemQuantity,
                items: [
                    {
                        item_id: itemID,
                        item_name: itemName,
                        price: itemPrice,
                        quantity: itemQuantity
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
                    price: orderLine.unitPrice.net,
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

    // add-to-cart pdp page
    $(".product-detail button").unbind().click(function () {
        const itemID = $(productDetail).find('.item-number-top span').text() || ''
        const itemName = $(productDetail).find(".product-description").text() || ''
        const itemPrice = parseFloat($(productDetail).find(".product-pricing .display-price .price").text().replace(/[^.0-9]/g, '')) || 0.00
        const itemQuantity = Number($(productDetail).find(".order-actions .input-text").val()) || 1
        gtag('event', 'add_to_cart', {
            currency: "USD",
            value: itemPrice * itemQuantity,
            items: [
                {
                    item_id: itemID,
                    item_name: itemName,
                    price: itemPrice,
                    quantity: itemQuantity
                },
            ]
        });
    })



});

domObserver.observe(document.body, { childList: true, subtree: true });
