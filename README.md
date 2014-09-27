# ee-shopify

Shopify API wrapper

Suppoorts all APIs and all standard methods. 

## installation

    npm install ee-shopify

## build status

[![Build Status](https://travis-ci.org/eventEmitter/ee-shopify.png?branch=master)](https://travis-ci.org/eventEmitter/ee-shopify)


## usage



### Constructor

You may set up the shop instance using the API key and the secret and or the api token.
    
    var   ShopifyAPI = require('ee-shopify')
        , log        = require('ee-log');

    // instantiate using the apikey && secret
    var myShop = new ShopifyAPI({
          shop      : 'myShopName'          // myShopName.myshopify.com
        , key       : 'td0fasf0987..'       // the shopify API key
        , secret    : 'l34k5h..'            // the shopify secret
    });

    // or instantiate using the api token
    var myShop = new ShopifyAPI({
          shop      : 'myShopName'          // myShopName.myshopify.com
        , token     : 'td0fasf0987..'       // the shopify API token
    });


### Querying the API

When retreiving data from the API two methods `find` and `findOne` on the query builders can be used. Both methods take 
a callback which receives an error object as parameter 1 and a data object as parameter 2


    // loading orders of the shop
    myShop.order().find(function(err, data) {
        if (err) log(err);
        else {
            // should have recevied some data
            log(data);
        }
    });


    // load all transactions for the order 312
    myShop.order(312).transaction().find(function(err, data) {
        if (err) log(err);
        else {
            // should have recevied some data
            log(data);
        }
    });


### Storing new Data

    new myShop.order({}).save(function(err, data) {
        if (err) log(err);
        else {
            // should have recevied some data
            log(data);
        }
    });


### Requesting data without the API wrapper

You may also request data without the need to use the api wrapper, you may use the `request` method for that.


#### GET Request `get(URL, [query], callback);`
    
    myShop.get('/orders.json', function(err, data) {
        if (err) log(err);
        else log(data);     // data without envelope
    });


#### POST Request `post(URL, [data], callback);`
    
    myShop.post('/orders/{id}.json', {key: value}, function(err, data) {
        if (err) log(err);
        else log(data);     // data without envelope
    });


#### PUT Request `put(URL, [data], callback);`
    
    myShop.put('/orders/{id}.json', function(err, data) {
        if (err) log(err);
        else log(data);     // data without envelope
    });


#### DELETE Request `delete(URL, [data], callback);`
    
    myShop.delete('/orders/{id}.json', function(err, data) {
        if (err) log(err);
        else log(data);     // data without envelope
    });