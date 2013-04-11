define([
    'jquery',
    'underscore',
    'backbone',
    'apps/resume/router',
    'text!apps/resume/templates/app.html'
], function ($, _, Backbone, Router, AppTemplate) {

    var View = Backbone.View.extend({

        events: {},

        initialize: function() {
            _.bindAll(this);
        },

        render: function() {
            this.$el.html(_.template(AppTemplate, {}));

            return this;
        }

    });

    return new View();
});