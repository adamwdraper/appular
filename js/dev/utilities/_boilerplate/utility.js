define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

    var view = Backbone.View.extend({

        events: {},

        initialize: function () {},

        render: function () {
            return this;
        }

    });

    return new view();
});