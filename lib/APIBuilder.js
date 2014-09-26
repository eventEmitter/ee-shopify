!function(){
    'use strict';

    var   Class             = require('ee-class')
        , EventEmitter      = require('ee-event-emitter')
        , log               = require('ee-log')
        , type              = require('ee-types')
        , argv              = require('ee-argv')
        , request           = require('request')
        , url               = require('url')
        , crypto            = require('crypto')
        , http              = require('http')
        , debug             = argv.has('debug-shopify')
        , api               = require('./api');



    // ebuild the api
    module.exports = new Class({
        inherits: EventEmitter

        // list of modelnames availabel on shops
        , _modelNames: api.modelNames

        // models
        , _models: api.models

        // querybuilders
        , _queryBuilders: api.queryBuilders



        , init: function() {
            this._createAccessors();
        }


        /*
         * since a new model can be created with the new keyword we need to make sure 
         * we can pass the scope into the model
         */
        , _createAccessors: function() {
            var self = this;

            // build querybuilder / models to context
            this._modelNames.forEach(function(key) {
                var Constructor = this[key] = function(data, fields) {
                    if (this instanceof Constructor) {
                        // Model
                        return new self._models[key](self, data);
                    }
                    else {
                        // QB
                        return new self._queryBuilders[key](self, data, fields);
                    }
                }
            }.bind(this));
        }
    });
}();
