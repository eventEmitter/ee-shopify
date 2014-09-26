
	
	var   Class 		= require('ee-class')
		, log 			= require('ee-log')
		, assert 		= require('assert')
		, travis 		= require('ee-travis');

	//process.argv.push('--debug-shopify');

	var   Shop = require('../')
		, shop;



	describe('A Shopify Shop', function() {
		it('should not crash when instantiated', function() {
			shop = new Shop({
				  shop 		: 'pasito-stage'
				, key 		: 'api key'
				, secret 	: 'secret'
				, token 	: ''
			});

			log(shop);
		});

		it('should expose the shopify api', function() {
			assert(shop.order);
		});

		it('should let you build queries', function(done) {
			shop.blog(234).article().find(function(err, data) {
				log(err, data);
			})
		});
	});
	