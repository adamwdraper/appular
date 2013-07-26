define([
    'jquery',
    'underscore',
    'backbone',
    'text!plugins/_boilerplate/teplates/plugin.html'
], function($, _, Backbone, Template) {

    var View = Backbone.View.extend({

        events: {},


        initialize: function () {
        },

        render: function () {
            this.$el.html(_.template(Template, {}));

            return this;
        }

    });

    return View;
});