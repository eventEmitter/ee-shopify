!function(){
    'use strict';

    // after the gold rush

    var   Class             = require('ee-class')
        , EventEmitter      = require('ee-event-emitter')
        , log               = require('ee-log')
        , type              = require('ee-types')
        , argv              = require('ee-argv')
        , debug             = argv.has('debug-shopify');



    // ebuild the api
    module.exports = new Class({
        inherits: EventEmitter


        , getShop: function() {
            if (this._parent) return this._parent.isShop ? this._parent : this._parent.getShop();
            else throw new Error('Failed to retreive parent object!');
        }


        , getParent: function() {
            if (this._parent) return this._parent;
            else throw new Error('Failed to retreive parent object!');
        }


        , hasParent: function() {
            return !!this._parent;
        }
    });
}();
