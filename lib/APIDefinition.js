!function() {
    'use strict';


    module.exports = {
          applicationCharge: {
              api: 'application_charge'
            , envelope: 'application_charge'
            , list: true
            , listOne: true
            , create: true
            , customMethods: {
                activate: function(callback) {
                    this._data.status = 'accepted';
                    this.save(callback);
                }
            }
        }
        , articleAuthor: {
              api: 'authors'
            , envelope: 'authors'
            , list: true
        }
        , articleTag: {
              api: 'tags'
            , envelope: 'tags'
            , list: true
        }
        , blog: {
              hasMany: ['article']
            , api: 'blogs'
            , envelope: 'blogs'
            , children: {
                article: {
                      hasOne: ['blog']
                    , hasMany: ['comment']
                    , api: 'articles'
                    , envelope: 'articles'
                    , list: true
                    , count: true
                    , create: true
                    , listOne: true
                    , updateOne: true
                    , deleteOne: true
                }
            }
            , list: true
            , count: true
            , create: true
            , listOne: true
            , updateOne: true
            , deleteOne: true
        }
        , carrierService: {
              api: 'carrier_services'
            , envelope: 'carrier_services'
            , create: true
            , updateOne: true
            , list: true
            , listOne: true
            , deleteOne: true
        }
        , checkout: {
              api: 'checkouts'
            , envelope: 'checkouts'
            , count: true
            , list: true
        }
        , collect: {
              hasOne: ['product', 'customCollection']
            , api: 'collects'
            , envelope: 'collects'
            , create: true
            , deleteOne: true
            , list: true
            , listOne: true
            , count: true
        }
        , comment: {
              hasOne: ['article']
            , api: 'comments'
            , envelope: 'comments'
            , list: true
            , count: true
            , listOne: true
            , create: true
            , updateOne: true
            , customMethods: {
                  spam: function() {}
                , notspam: function() {}
                , approve: function() {}
                , remove: function() {}
                , restore: function() {}
            }
        }
        , country: {
              hasMany: ['province']
            , api: 'countries'
            , envelope: 'countries'
            , list: true
            , count: true
            , listOne: true
            , create: true
            , updateOne: true
            , deleteOne: true
            , children: {
                province: {
                      hasOne: ['country']
                    , api: 'provinces'
                    , envelope: 'provinces'
                    , list: true
                    , listOne: true
                    , count: true
                    , updateOne: true
                }
            }
        }
        , customCollection: {
              hasMany: ['collect']
            , api: 'custom_collections'
            , envelope: 'custom_collections'
            , list: true
            , count: true
            , listOne: true
            , create: true
            , updateOne: true
            , deleteOne: true
        }
        , customer: {
              hasOne: ['shop']
            , hasMany: ['cart']
            , api: 'customers'
            , envelope: 'customers'
            , list: true
            , listOne: true
            , create: true
            , updateOne: true
            , deleteOne: true
            , count: true
            , customMethods: {
                search: function() {}
            }
        }
        , customerSavedSearch: {
              hasMany: ['customer']
            , api: 'customer_saved_searches'
            , envelope: 'customer_saved_searches'
            , list: true
            , count: true
            , listOne: true
            , create: true
            , updateOne: true
            , deleteOne: true
            , customMethods: {
                customers: function() {}
            }
        }
        , event: {
              hasOne: ['article', 'smartCollection', 'product', 'page', 'order', 'comment', 'customCollection', 'blog']
            , api: 'events'
            , envelope: 'events'
            , list: true
            , listOne: true
            , count: true
        }
        , fulfillmentService: {
              api: 'fulfillment_services'
            , envelope: 'fulfillment_services'
            , list: true
            , create: true
            , listOne: true
            , updateOne: true
            , deleteOne: true
        }
        , location: {
              api: 'locations'
            , envelope: 'locations'
            , listOne: true
            , list: true
        }
        , metaField: {
              hasOne: ['blog', 'productVariant', 'product', 'page', 'order', 'customer', 'customCollection']
            , api: 'metaFields'
            , envelope: 'metaFields'
            , list: true
            , count: true
            , listOne: true
            , create: true
            , updateOne: true
            , deleteOne: true
        }
        , order: {
              hasOne: ['customer']
            , hasMany: ['fulfillment', 'transaction']
            , api: 'orders'
            , envelope: 'orders'
            , listOne: true
            , list: true
            , count: true
            , create: true
            , updateOne: true
            , deleteOne: true
            , customMethods: {
                  close: function() {}
                , open: function() {}
                , cancel: function() {}
            }
            , children: {
                fulfillment: {
                      hasOne: ['order']
                    , api: 'fulfillments'
                    , envelope: 'fulfillments'
                    , list: true
                    , count: true
                    , listOne: true
                    , create: true
                    , updateOne: true
                    , customMethods: {
                          complete: function() {}
                        , cancel: function() {}
                    }
                }
                , risk: {
                      api: 'risks'
                    , envelope: 'risks'
                    , create: true
                    , list: true
                    , listOne: true
                    , updateOne: true
                    , deleteOne: true
                }
                , refund: {
                      api: 'refunds'
                    , envelope: 'refunds'
                    , listOne: true
                }
                , transaction: {
                      api: 'transactions'
                    , envelope: 'transactions'
                    , list: true
                    , listOne: true
                    , count: true
                    , create: true
                }
            }
        }
        , page: {
              api: 'pages'
            , envelope: 'pages'
            , list: true
            , count: true
            , listOne: true
            , create: true
            , updateOne: true
            , deleteOne: true
        }
        , product: {
              hasMany: ['collect', 'productVariant', 'productImage']
            , api: ''
            , envelope: ''
            , children: {
                metaField: {
                      hasOne: ['blog', 'productVariant', 'product', 'page', 'order', 'customer', 'customCollection']
                    , api: 'metaFields'
                    , envelope: 'metaFields'
                    , list: true
                    , count: true
                    , listOne: true
                    , create: true
                    , updateOne: true
                    , deleteOne: true
                }
                , image: {
                      api: 'images'
                    , envelope: 'images'
                    , list: true
                    , count: true
                    , listOne: true
                    , create: true
                    , updateOne: true
                    , deleteOne: true
                }
                , variant: {
                      list: true
                    , count: true
                    , create: true
                    , deleteOne: true
                }
            }
        }
        , productVariant: {
              hasOne: ['product']
            , api: 'variants'
            , envelope: 'variants'
            , listOne: true
            , updateOne: true
        }       
        , recurringApplicationCharge: {
              api: 'recurring_application_charges'
            , envelope: 'recurring_application_charges'
            , create: true
            , listOne: true
            , list: true
            , deleteOne: true
            , customMethods: {
                  activate: function() {}
            }
        }
        , redirect: {
              api: 'redirects'
            , envelope: 'redirects'
            , list: true
            , listOne: true
            , count: true
            , create: true
            , updateOne: true
            , deleteOne: true
        }
        , shop: {
              hasMany: ['customer', 'cart']
            , api: 'shop'
            , envelope: 'shop'
            , list: true
        }
        , smartCollection: {
              hasOne: ['collect']
            , api: 'smart_collections'
            , envelope: 'smart_collections'
            , list: true
            , listOne: true
            , count: true
            , create: true
            , updateOne: true
            , deleteOne: true
            , customMethods: {
                order: function() {}
            }
        }
        , theme: {
              hasMany: ['asset']
            , api: 'themes'
            , envelope: 'themes'
            , list: true
            , listOne: true
            , create: true
            , updateOne: true
            , deleteOne: true
            , children: {
                asset: {
                      hasOne: ['theme']
                    , api: 'assets'
                    , envelope: 'assets'
                    , list: true
                    , listOne: true
                    , updateOne: true
                    , deleteOne: true
                }
            }
        }
        , user: {
              api: 'users'
            , envelope: 'users'
            , list: true
            , listOne: true
        }
        , webhook: {
              api: 'webhooks'
            , envelope: 'webhooks'
            , list: true
            , listOne: true
            , count: true
            , create: true
            , updateOne: true
            , deleteOne: true
        }
    };
}();
