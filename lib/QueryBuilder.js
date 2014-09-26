!function(){
    'use strict';


    var   Class             = require('ee-class')
        , EventEmitter      = require('ee-event-emitter')
        , log               = require('ee-log')
        , type              = require('ee-types')
        , argv              = require('ee-argv')
        , debug             = argv.has('debug-shopify')
        , AbstractAPI       = require('./AbstractAPI');

  

    module.exports = new Class({
          inherits: AbstractAPI

        , isQueryBuilder: {value: true}

        // the type of the requested content
        , _contentType: '.json'


        , init: function(parent, filter, fields) {
            this._setArgument(filter);
            this._setArgument(fields);

            this._parent        = parent;
            this._fields        = fields;
        }



        /*
         * load a collection from the api
         *
         * @param <Function> callback
         */
        , find: function(callback) {
            this.getShop().request('get', this.buildPath()+this._contentType, this._filter, callback);
        }



        /*
         * load a resource from the api
         *
         * @param <Function> callback
         */
        , findOne: function(callback) {

        }



        /*
         * if loading a collection, specifies which page should be loaded
         *
         * @param <Number> the page offset
         */
        , page: function(page) {
            this._page = page;
            return this;
        }


        /*
         * pgaesize when loading from a collection
         *
         * @param <Number> the page size
         */
        , limit: function(limit) {
            this._limit = limit;
            return this;
        }



        /*
         * delete a resource without loading it from the api
         *
         * @param <Function> callback
         */
        , delete: function(callback) {

        }



        /*
         * count a collection
         *
         * @param <Function> callback
         */
        , count: function(callback) {

        }



        , buildPath: function() {
            var prefix = (this.hasParent() && this.getParent().isQueryBuilder) ? this.getParent().buildPath() : '';
            return prefix + '/' + this.apiName + this._buildPathFilter();
        }



        , _buildPathFilter: function() {
            if (this._id) {
                return '/' + this._id;
            }

            return '';
        }


 
        , _setArgument: function(arg) {
             if (type.number(arg) || type.string(arg)) this._id = arg;
             else if (type.array(arg)) this._fields = arg;
             else if (type.object(arg)) this._filter = arg;
             else if (type.undefined(arg) || type.null(arg));
             else throw new Error('Cannot process argument passed to the query builder, must be type of string, number, array or object, null or undefined. got «'+type(arg)+'»!');
        }
    });
}();
