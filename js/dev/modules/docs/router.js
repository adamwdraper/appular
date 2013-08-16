define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {
    var Router = Backbone.Router.extend({

        initialize: function () {},

        routes: {
            '': 'index'
        },

        index: function () {}

    });

    return new Router();
});