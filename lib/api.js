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
        , APIDefinition     = require('./APIDefinition')
        , QueryBuilder      = require('./QueryBuilder')
        , Model             = require('./Model');



    // ebuild the api
    module.exports = new(new Class({
        
        // list of modelnames availabel on shops
        modelNames: Object.keys(APIDefinition)

        // models
        , models: {}

        // querybuilders
        , queryBuilders: {}

        // definition
        , definition: APIDefinition


        /*
         * class constructor
         */
        , init: function() {
            this._buildAPI(APIDefinition);
        }


        /*
         * recursice model creation
         */
        , _buildAPI: function(definition) {
            this.modelNames.forEach(function(modelName) {
                this.models[modelName] = this._createModel(modelName, definition[modelName]);
                this.queryBuilders[modelName] = this._createQueryBuilder(modelName, definition[modelName]);
            }.bind(this));
        }


        /*
         * create querybuilders with sub querybuilders
         */
        , _createQueryBuilder: function(modelName, definition) {
            var classDefinition = {inherits: QueryBuilder};

            // name
            classDefinition.name        = {value: modelName, enumerable: true};
            classDefinition.apiName     = {value: definition.api, enumerable: true};
            classDefinition.definition  = {value: definition};


            // check for submodels
            if (type.object(definition.children)) {
                Object.keys(definition.children).forEach(function(childName) {
                    var SubqueryBuilder = this._createQueryBuilder(childName, definition.children[childName]);

                    classDefinition[childName] = function(data, fields) {
                        return new SubqueryBuilder(this, data, fields);
                    };
                }.bind(this));
            }

            return new Class(classDefinition);
        }



        /*
         * create a model with submodels
         */
        , _createModel: function(modelName, definition) {
            var classDefinition = {inherits: Model};

            // name
            classDefinition.name        = {value: modelName};
            classDefinition.apiName     = {value: definition.api, enumerable: true};
            classDefinition.definition  = {value: definition};

            // check for submodels
            if (type.object(definition.children)) {
                Object.keys(definition.children).forEach(function(childName) {
                    var SubModel = this._createModel(childName, definition.children[childName]);

                    classDefinition[childName] = function(data) {
                        return new SubModel(this, data);
                    };
                }.bind(this));
            }

            return new Class(classDefinition);
        }
    }))();
}();
