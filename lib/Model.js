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

        , isModel: {value: true}


        , init: function(parent, data, loadedFromAPI) {
            this._data      = data;
            this._parent    = parent;
            this._isUpdate  = !!loadedFromAPI;
        }


        /*
         * save a new model instnace or update one loaded from the api
         *
         * @param <Function> callback
         */
        , save: function(callback) {
            if (this._isUpdate) {
                 if (!this.definition.updateOne) callback(new Error('The «'+this.name+'» api has no update method!'));
                 else {

                 }
            }
            else {
                if (!this.definition.create) callback(new Error('The «'+this.name+'» api has no create method!'));
                else {
                    
                }
            }
           
        }



        /*
         * delete a model instance from the api
         *
         * @param <Function> callback
         */
        , delete: function(callback) {
            if (!this.definition.deleteOne) callback(new Error('The «'+this.name+'» api has no delete method!'));
            else {
                
            }
        }
    });
}();
