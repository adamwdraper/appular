define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {

    var View = Backbone.View.extend({

        events: {},

        initialize: function () {
            _.bindAll(this);
        },

        render: function () {
            Backbone.trigger('app:initialized');

            return this;
        }

    });

    return View;
});