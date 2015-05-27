/**
 * @appular test
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'utilities/storage/utility',
    'utilities/cookies/utility'
], function ($, _, Backbone, storage, cookies) {
    var Router = Backbone.Router.extend({
            history: {},
            params: {
                hash: {
                    value: null,
                    loadFrom: 'hash',
                    addToUrl: true
                },
                data: {
                    value: null,
                    loadFrom: 'data',
                    addToUrl: false
                },
                query: {
                    value: null,
                    loadFrom: 'query',
                    addToUrl: false
                },
                storage: {
                    value: null,
                    loadFrom: 'storage',
                    addToUrl: false
                },
                cookie: {
                    value: null,
                    loadFrom: 'cookie',
                    addToUrl: false
                }
            },
            setup: function () {
                log('setup');

                log('router', 'data', this.data);

                log('router', 'components', this.components);

                this.start();
            },
            routes: {
                '*params': 'action'
            },
            action: function () {
                this.renderAll();
            }
        });

    return Router;
});