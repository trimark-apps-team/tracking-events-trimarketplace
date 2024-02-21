console.log('hello')
console.log(dataLayer)

dataLayer.push({
    event: 'site_event',
    event_category: 'test',
    event_action: 'visit page'
});