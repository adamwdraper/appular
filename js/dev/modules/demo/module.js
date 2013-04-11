define([
    'jquery',
    'underscore',
    'backbone',
    'modules/demo/router',
    'moment',
    'numeral',
    'text!modules/demo/templates/module.html'
], function ($, _, Backbone, Router, Moment, Numeral, Template) {

    var View = Backbone.View.extend({

        events: {},

        initialize: function() {
            _.bindAll(this);
        },

        render: function() {
            this.$el.html(_.template(Template, {}));

            return this;
        }

    });

    return new View();
});