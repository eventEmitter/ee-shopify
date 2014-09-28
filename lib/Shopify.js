!function(){
    'use strict';


	var   Class 		    = require('ee-class')
        , EventEmitter      = require('ee-event-emitter')
		, log 			    = require('ee-log')
        , type              = require('ee-types')
        , argv              = require('ee-argv')
        , request           = require('request')
        , url               = require('url')
        , crypto            = require('crypto')
        , http              = require('http')
        , debug             = argv.has('debug-shopify')
        , APIBuilder        = require('./APIBuilder');




	module.exports = new Class({
        inherits: APIBuilder

        , isShop: {value: true}

        // the shop name of the shop working on
        , _shop: null

        // may waiting time for requests in ms
        , ttl: 10000

        // the access token
        , token: null

        // api key & secret
        , credentials: {
              key    : null
            , secret : null
        }

        // scope
        , scope: []

        // shopify domain
        , _shopifyhost: 'myshopify.com'

        // the protocol to use to contact shopify
        , _protocol: 'https'

        // valid request methods
        , _validMethods: ['get', 'post', 'put', 'delete'] 

        // url prefix
        , _urlPrefix: '/admin'

        // regexp for parsing the request imit / bucket size
        , _rateReg: /^([0-9]+)\/([0-9]+)$/gi



        /*
         * Shopify constructor function
         *
         * @param «Object» object containing the shops identifier «shop» and the apps api key «apiKey» or the apps auth token «token»
         */
		, init: function init(options) {
            if (!options) throw new Error('You have to provide an options object to the shopifys constructor function!');
            if (!type.string(options.shop) || !options.shop.trim()) throw new Error('You have to provide a shop property to the shopifies constructor function!');

            // the shop identifier
            Class.define(this, '_shop', Class(options.shop));

            // the shopify access token, if present
            if (type.string(options.token) && options.token.trim()) {
                if (debug) log.info('got shopify auth token via contructor «%s» ...', options.token);
            }
            else if (type.string(options.key) && options.key.trim() && type.string(options.secret) && options.secret.trim()) {
                if (debug) log.info('got shopify api key & secret via contructor «%s», %s ...', options.key, options.secret);
            }
            else throw new Error('You have to provide either the api key and secret or the auth token to the shopifies constructor function!');

            // store credentials
            this.credentials.key    = options.key;
            this.credentials.secret = options.secret;

            Class.define(this, 'token', Class(options.token));

            // scope, optional
            if (type.array(options.scope) || type.string(options.scope)) this._scope = options.scope;

            // set up super
            init.super.call(this);
		}


        /*
         * create the auth url used to connect a shop
         *
         * @param <Mixed> array or string containg the requested scope
         * @param <String> redirect URL
         * 
         */
        , getAuthURL: function(scope, redirectURL) {
            // load scopen from the shop instance?
            if (arguments.length === 1) {
                redirectURL = scope;
                scope = this._scope;
            }

            // cehck input validity
            if (!type.array(scope) && (!type.string(scope) || !scope.trim())) throw new Error('You have to provide the apps scope as parameter 1 to the getAuthURL method!');
            if (!type.string(redirectURL) || !redirectURL.trim()) throw new Error('You have to provide the redirect URL as parameter 2 to the getAuthURL method!');

            return url.format({
                  protocol          : this._protocol
                , host              : this._shopifyhost
                , pathname          : '/admin/oauth/authorize'
                , query: {
                      client_id     : this.credentials.key
                    , scope         : type.array(scope) ? scope.join(',') : scope 
                    , redirect_uri  : redirectURL
                }
            });
        }



        /*
         * create a redirect url that can be used for the user to autorize the shop
         */
        , getRedirectURL: function() {
            return url.format({
                  protocol          : this._protocol
                , host              : this._shopifyhost
                , pathname          : '/admin/api/auth'
                , query: {
                    api_key         : this.credentials.key
                }
            });
        }



        /*
         * exchange code received from the shopify api with the api token, stores it ok this instance
         *
         * @param <Mixed> request query parameters or url containg parameters or request object
         * @param <Function> callback
         * 
         */
        , getToken: function(query, callback) {
            var code;

            // request
            if (query instanceof http.IncomingMessage) {
                query = url.parse(query.url).query;

                if (type.object(query) && query.code) code = query.code;
                else return callback(new Error('Failed to get code from request!'));
            }

            // custom request
            else if (type.object(query) && type.object(query.query) && type.string(query.query.code)) {
                query = query.query;
                code = query.code;
            }

            // query object
            else if (type.object(query) && type.string(query.code)) code = query.code;

            // not valid
            if (!type.string(code)) return callback(new Error('Failed to get code'));



            // check signature
            if (this.isInvalidQuerySignature(query)) return callback(new Error('Invalid sginature!'));
            else {
                // request the token
                this.request('post', '/oauth/access_token', {
                      client_id         : this.credentials.key
                    , client_secret     : this.credentials.secret
                    , code              : code
                }, function(err, data, response) {
                    if (err) callback(err);
                    else if (!type.string(data)) callback('Request failed, no token was returned!');
                    else {
                        this.token = data;
                        callback(undefined, this.token);
                    }
                }.bind(this));
            }
        }




        /*
         * check the signature of the request query
         *
         * @param <Mixed> request query parameters, request or url containg parameters
         * 
         * @returns <Mixed> Error, True, or False
         */
        , isInvalidQuerySignature: function(query) {
            var signature;

            // url or querystring
            if (type.string(query)) query = url.parse(query).query;

            // node http request
            else if (type.object(query) && query instanceof http.IncomingMessage) query = url.parse(query).query;

            // custom request implementation
            else if (type.object(query) && type.object(query.query)) query = query.query;

            // need an objects
            if (!type.object(query)) return new Error('Invalid signature! Missing signature & data!');

            

            // check signature
            return !(crypto.createHash('md5').update(this.credentials.secret+Object.keys(query).sort().map(function(key) {
                if (key.trim().toLowerCase() === 'signature') {
                    signature = query[key];
                    return '';
                }
                else return key+'='+query[key];
            }).join('')).digest('hex') === signature && signature);
        }




        /*
         * check the signature of the request body
         *
         * @param <Mixed> request or request headers or signature header
         * @param <Mixed> payload, buffer or string
         *
         * @returns <Mixed> Error, True, or False
         *
         */
        , isInvalidBodySignature: function(header, data) {
            var signature;

            // header an data pair
            if (type.string(header) || header instanceof http.IncomingMessage) {
                if (type.object(header)) signature = header.headers['X-Shopify-Hmac-SHA256'];
                else signature = header;
            }

            // custom request implementation
            else if (type.object(header) && type.object(header.headers)) signature = header.headers['X-Shopify-Hmac-SHA256'];

            // another ttype of custom requests
            else if (type.object(header) && type.function(header.getHeader)) signature = header.getHeader('X-Shopify-Hmac-SHA256');



            // check if we got the signature header
            if (!signature) return new Error('Invalid signature! Missing signature header!');


            // check for payload
            if (type.string(data)) data = new Buffer(data);
            else if (!type.buffer(data)) return new Error('Invalid signature! Missing payload data!');


            if (!this.credentials.secret) return new Error('Cannot validate the signature, secret is missing (provide it in the sgopify constructor function)!');

            // check signature
            return !(signature === crypto.createHmac('sha256', this.credentials.secret).update(data).digest('base64'));
        }





        /*
         * get a resource from the shopify API
         * 
         * @param <String>      pathname
         * @param <Mixed>       query data
         * @param <function>    callback
         *
         */
        , get: function(pathName, data, callback) {
            this.request('get', pathName, data, callback);
        }



        /*
         * post a resource to the shopify API
         * 
         * @param <String>      pathname
         * @param <Mixed>       body data: object, string or buffe
         * @param <function>    callback
         *
         */
        , post: function(pathName, data, callback) {
            this.request('post', pathName, data, callback);
        }



        /*
         * update a resource on the shopify API
         * 
         * @param <String>      pathname
         * @param <Mixed>       body data: object, string or buffe
         * @param <function>    callback
         *
         */
        , put: function(pathName, data, callback) {
            this.request('put', pathName, data, callback);
        }




        /*
         * delete a resource on the shopify API
         * 
         * @param <String>      pathname
         * @param <Mixed>       query data
         * @param <function>    callback
         *
         */
        , delete: function(pathName, data, callback) {
            this.request('delete', pathName, data, callback);
        }




        /*
         * request a resource from the shopify API
         * 
         * @param <String>      http method (get, put, post)
         * @param <String>      pathname
         * @param <Mixed>       body data: object, string or buffer, either the query
         *                      (get requests) or the request body, or callback
         * @param <function>    callback
         *
         */
        , request: function(method, pathName, data, callback) {
            var   isJSON = false
                , body
                , query
                , requestDefinition;

            if (!type.string(method) || !method.trim()) throw new Error('You have to provide the method as parameter 1 to the request method!');
            if (this._validMethods.indexOf(method.toLowerCase().trim()) === -1) throw new Error('Invalid request method «'+method+'». You have to provide the method ('+this._validMethods.join(', ')+') as parameter 1 to the request method!');
            if (!type.string(pathName) || !pathName.trim()) throw new Error('You have to provide the pathName as parameter 2 to the request method!');
            
            method = method.toLowerCase().trim();
            if (type.function(data)) callback = data, data = undefined;

            if (method === 'get') {
                if (!type.object(data) && !type.string(data) && !type.null(data) && !type.undefined(data)) throw new Error('You have to provide the query (parameter 3) as type undefined, null, object, string! You provided type '+type(data)+'!');
                query = data;
            }
            else {
                switch (type(data)) {
                    case 'object':
                    case 'array':
                        isJSON = true;
                        body = new Buffer(JSON.stringify(data));
                        break;

                    case 'string': 
                        body = new Buffer(data);
                        break;

                    case 'buffer':
                    case 'null':
                    case 'undefined':
                        body = data;
                        break;

                    default: 
                        throw new Error('You have to provide the request body (parameter 3) as type undefined, null, object, string or buffer! You provided type '+type(data)+'!');
                }
            }


            // build the request from the different components
            requestDefinition = {
                  method            : method
                , headers: {
                      accept        : 'application/json'
                }
                , url: url.format({
                      protocol      : this._protocol
                    , host          : this._shop+'.'+this._shopifyhost
                    , pathname      : pathName.toLowerCase().trim().substr(0, 7) === '/admin/' ? pathName : (this._urlPrefix+(pathName[0] === '/' ? '' : '/' )+pathName)
                    , query         : query
                })
            };

            //if (method !== 'get') requestDefinition.headers['Content-Length'] = body ? body.length : 0;
            if (this.token) requestDefinition.headers['X-Shopify-Access-Token'] = this.token;
            if (isJSON) requestDefinition.headers['Content-Type'] = 'application/json';

            if (body) requestDefinition.body = body;


            if (debug) log.info('['+method+'] request on «'+pathName+'» ...', requestDefinition);


            // fire request
            request(requestDefinition, function(err, response, body) {
                var   responseData
                    , keys;

                if (err) callback(err, undefined, response);
                else {
                    // extract the request limits
                    this._parseLimits(response.headers);

                    if (response.statusCode === 200 || response.statusCode === 201 || response.statusCode === 204) {

                        // process only if there is abody
                        if (type.string(body) && body.trim()) {
                            // try to parse the response
                            try {
                                responseData = JSON.parse(body.trim());
                            } catch(e) {
                                err = e;
                            }

                            // if we cannot parse the data, abort
                            if (err) callback(err, undefined, response);
                            else {
                                // is there any data at all?
                                if (type.object(responseData)) {
                                    keys = Object.keys(responseData);

                                    // remove the envelope if there is only one key in it
                                    if (keys.length === 1) callback(null, responseData[keys[0]]);
                                    else callback(null, responseData, response);
                                }
                                else callback(undefined, undefined, response);
                            }
                        }
                        else callback(undefined, undefined, response);
                    }
                    else {
                        responseData = this._getErrorMessage(body);

                        // treat everything as error
                        err             = new Error(responseData.message);
                        err.statusCode  = response.statusCode;
                        err.status      = http.STATUS_CODES[response.statusCode];
                        err.data        = responseData.data;
                        callback(err, undefined, response);
                    }
                }
            }.bind(this));
        }



        /*
         * parses the rate limit header
         */
        , _parseLimits: function(headers) {
            var result;

            if (type.object(headers) && type.string(headers['x-shopify-shop-api-call-limit'])) {
                this._rateReg.lastIndex = 0;
                result = this._rateReg.exec(headers['x-shopify-shop-api-call-limit']);

                if (result) {
                    this._bucketSize = parseInt(result[2], 10);
                    this._requestCount = parseInt(result[1], 10);

                    return {
                          limit: this._bucketSize
                        , count: this._requestCount
                    };
                }
                else return null;
            }
            else return null;
        }


        /*
         * tries to get a menaingful errormessage from the response
         */
        , _getErrorMessage: function(data) {
            var responseData;

            try {
                responseData = JSON.parse(data.trim());
            } catch(e) {}


            if (responseData) {
                if (type.string(responseData.error)) return {message: responseData.error + (type.string(responseData.error_description) ? ': '+responseData.error_description : ''), data: responseData};
                else if (type.array(responseData.error) && responseData.error.length) return {message: responseData.error[0], data: responseData};
                else if (type.string(responseData.errors)) return {message: responseData.errors, data: responseData};
                else if (type.array(responseData.errors) && responseData.errors.length) return {message: responseData.errors[0], data: responseData};
                else return {message: data, data: responseData};
            }
            else return {message: data, data: data};;
        }
	});
}();
