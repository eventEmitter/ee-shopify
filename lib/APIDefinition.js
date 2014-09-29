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
            , envelope: 'author'
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
            , envelope: 'blog'
            , children: {
                article: {
                      hasOne: ['blog']
                    , hasMany: ['comment']
                    , api: 'articles'
                    , envelope: 'article'
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
            , envelope: 'carrier_service'
            , create: true
            , updateOne: true
            , list: true
            , listOne: true
            , deleteOne: true
        }
        , checkout: {
              api: 'checkouts'
            , envelope: 'checkout'
            , count: true
            , list: true
        }
        , collect: {
              hasOne: ['product', 'customCollection']
            , api: 'collects'
            , envelope: 'collect'
            , create: true
            , deleteOne: true
            , list: true
            , listOne: true
            , count: true
        }
        , comment: {
              hasOne: ['article']
            , api: 'comments'
            , envelope: 'comment'
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
            , envelope: 'countrie'
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
                    , envelope: 'province'
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
            , envelope: 'custom_collection'
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
            , envelope: 'customer'
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
            , envelope: 'customer_saved_searche'
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
            , envelope: 'event'
            , list: true
            , listOne: true
            , count: true
        }
        , fulfillmentService: {
              api: 'fulfillment_services'
            , envelope: 'fulfillment_service'
            , list: true
            , create: true
            , listOne: true
            , updateOne: true
            , deleteOne: true
        }
        , location: {
              api: 'locations'
            , envelope: 'location'
            , listOne: true
            , list: true
        }
        , metaField: {
              hasOne: ['blog', 'productVariant', 'product', 'page', 'order', 'customer', 'customCollection']
            , api: 'metaFields'
            , envelope: 'metaField'
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
            , envelope: 'order'
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
                    , envelope: 'fulfillment'
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
                    , envelope: 'risk'
                    , create: true
                    , list: true
                    , listOne: true
                    , updateOne: true
                    , deleteOne: true
                }
                , refund: {
                      api: 'refunds'
                    , envelope: 'refund'
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
            , envelope: 'page'
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
                    , envelope: 'metaField'
                    , list: true
                    , count: true
                    , listOne: true
                    , create: true
                    , updateOne: true
                    , deleteOne: true
                }
                , image: {
                      api: 'images'
                    , envelope: 'image'
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
        , variant: {
              hasOne: ['product']
            , api: 'variants'
            , envelope: 'variant'
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
            , envelope: 'redirect'
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
            , envelope: 'smart_collection'
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
            , envelope: 'theme'
            , list: true
            , listOne: true
            , create: true
            , updateOne: true
            , deleteOne: true
            , children: {
                asset: {
                      hasOne: ['theme']
                    , api: 'assets'
                    , envelope: 'asset'
                    , list: true
                    , listOne: true
                    , updateOne: true
                    , deleteOne: true
                }
            }
        }
        , user: {
              api: 'users'
            , envelope: 'user'
            , list: true
            , listOne: true
        }
        , webhook: {
              api: 'webhooks'
            , envelope: 'webhook'
            , list: true
            , listOne: true
            , count: true
            , create: true
            , updateOne: true
            , deleteOne: true
        }
    };
}();
