define([
    '{%= $ %}',
    'underscore',
    'backbone'
], function ($, _, Backbone) {
    var Router = Backbone.Router.extend({

        initialize: function () {},

        routes: {
            '': 'index'
        },

        index: function () {
            console.log('index');
        }

    });

    return new Router();
});