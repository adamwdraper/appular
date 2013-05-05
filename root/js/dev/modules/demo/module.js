define([
    'jquery',
    'underscore',
    'backbone',
    'modules/demo/router',
    'text!modules/demo/templates/module.html'
], function ($, _, Backbone, Router, Template) {

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

    return View;
});