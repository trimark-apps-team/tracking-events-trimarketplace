window.addEventListener("load", (event) => {
    const dataLayer = window.dataLayer || [];
    console.log('hello')
    console.log('hello again')
    console.log('hello a third time')
    console.log(dataLayer)

    dataLayer.push({
        event: 'site_event',
        event_category: 'test',
        event_action: 'visit page'
    });
});


